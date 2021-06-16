import Head from 'next/head'
import { stripe } from '../services/stripe'
import { GetServerSideProps } from 'next'
import { SubscribeButon } from '../components/SubscribeButton'

import styles from './home.module.scss'

interface IHomeProps {
 product:{
    priceId: string;
    amount: number;
  }
}

export default function Home({product}: IHomeProps) {
  return (

    <>
    <Head>
      <title>Home | ig.news</title>
    </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButon priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}


export const  getServerSideProps: GetServerSideProps = async()=>{
  const price = await stripe.prices.retrieve('price_1J30gPLAmXfFirASbgLbY4sU')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US',{
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100),
  }
  
  return{
    props: {
      product
    }
  }
}