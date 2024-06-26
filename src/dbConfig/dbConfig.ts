import mongoose from "mongoose";


export async function connectDb(){

try {
   await mongoose.connect(process.env.MONGO_URI || '');
   const connection =  mongoose.connection
   connection.on('connected', () =>{
    console.log('MongoDB connected successfully')
   })


connection.on('error', (err)=>{
console.error('MongoDB connection error, please make sure db is up and running properly:' + err);
process.exit(1);
   })

} catch (error) {
    console.log('something went wrong in connecting to DB');
    console.log(error);
}

}