import mongoose from 'mongoose'

export const dbConnect = ()=>{
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log('database connected successfully')
    }).catch((err)=>{
        console.log('failed to connect to database')
    })
}