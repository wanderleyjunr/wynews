import {NextApiRequest, NextApiResponse} from 'next'

export default(request:NextApiRequest, response:NextApiResponse) => {
    const users = [
        {id:1, name: 'Diego'},
        {id:2, name: 'Dani'},
        {id:3, name: 'Rafa'},
        {id:4, name: 'Junior'},
    ]

    return response.json(users)
} 