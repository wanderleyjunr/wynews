import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { fauna } from "../../services/fauna";
import {query as q} from 'faunadb'
import { stripe } from "../../services/stripe";

interface IUser {
    ref: {
        id: string
    };
    data: {
        stripe_customer_id: string
    }
}


// eslint-disable-next-line import/no-anonymous-default-export
export default async(req: NextApiRequest, res:NextApiResponse) => {
    if( req.method === 'POST') {

        const session = await getSession({ req })

        const user = await fauna.query<IUser>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )


        let custmerId = user.data.stripe_customer_id
        if(!custmerId){  
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
            })
                       
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id,
                        }
                    }
                )
            )

            custmerId = stripeCustomer.id
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            customer:custmerId,
            payment_method_types: ['card'], //Method payment
            billing_address_collection: 'required',
            line_items: [
                {price: "price_1J30gPLAmXfFirASbgLbY4sU", quantity: 1}
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url:process.env.STRIPE_SUCCESS_URL,
            cancel_url:process.env.STRIPE_CANCEL_URL
        })
        return res.status(200).json({ sessionId: checkoutSession.id})
    } else {
        res.setHeader('Allow', 'POST')
       return res.status(405).end('Method not allowed')
    }
}