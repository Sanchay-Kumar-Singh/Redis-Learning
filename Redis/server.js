import express, { json } from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import User from "./models/useModel.js"
import Redis from "ioredis";
import ratelimit from "./middleware/ratelimit.js"
import emailQueue from "./queue.js"; 

const app=express();
app.use(express.json());
export const redis=new Redis(process.env.REDIS_URL)
connectDB();
app.get("/", (req, res) => {
    return res.status(200).json({ message: "hello from redis" })
})

app.post("/create",async(req,res)=>{
    const{name,email,password}=req.body;
      await redis.del("user:all")
    const user= await User.create({
        name,
        email,
        password
    })
      await emailQueue.add("send-email",{email})
    return res.status(201).json(user);
})
app.get("/get",ratelimit,async(req,res)=>{
    const user=await User.find({});
    
    return res.status(200).json(user)
})

app.get("/redis",async(req,res)=>{
    const cached=await redis.get("user:all");
    if(cached){
        const user=JSON.parse(cached);
        return res.status(200).json(user);
    }

    const user=await User.find({});
    await redis.set("user:all",JSON.stringify(user));


    return res.status(200).json(user);
})
app.get("/delete", async (req, res) => {
    const deletedUser = await User.findOneAndDelete({
        name: "sanchay"
    });

    if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    await redis.del("user:all"); // Clear cache

    return res.status(200).json({
        message: "User deleted successfully",
        deletedUser
    });
});




app.post("/send-otp",async(req,res)=>{
    const {email}=req.body;

    const otp=Math.floor(100000+Math.random()*900000).toString();
    await redis.set(`otp:${email}`,otp,"EX",30);
    return res.json({ otp })

})
app.get("/verify-otp",async(req,res)=>{
    const {email,otp}=req.body;
  
    const cachedOtp=await redis.get(`otp:${email}`);
      if (!cachedOtp) {
        return res.status(400).json({ "message": "otp not found or has been expired" })
    }
      if (cachedOtp != otp) {
        return res.status(400).json({ "message": "incorrect otp" })
    }
       await redis.del(`otp:${email}`)
    return res.json({ message: "otp verified" })

})

const PORT=process.env.PORT||PORT;

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})