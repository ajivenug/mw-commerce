const express= require("express");

const connectDB=require("./config/dbConnection")


const dotenv=require("dotenv").config();
const cors=require("cors");

connectDB();
const app=express();

const port= process.env.PORT||5000;

app.use(express.json());

app.use("/api/users",require("./routes/userRoute"))



app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})