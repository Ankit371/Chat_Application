import mongoose from 'mongoose'

// function to connect to database
export const connectdb = async ()=>{
    try {

        mongoose.connection.on('connected',()=>console.log("database connected"))
        await mongoose.connect(`${process.env.MONGODB_URI}/chat_app`)
    } catch (error) {
        console.log(error)
    }
}