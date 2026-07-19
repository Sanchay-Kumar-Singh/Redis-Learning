import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MONGODB connected");
    }catch(error){
         console.log("MONGODB failed");
        console.log(error);
    }
}
export default connectDB;