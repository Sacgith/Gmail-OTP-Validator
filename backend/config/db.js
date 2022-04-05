const dotenv=require('dotenv').config();
const mongoose=require('mongoose');

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("MongoDB connected");

        
    } catch (error) {
        console.log(err.message);
    }
}

module.exports=connectDB;