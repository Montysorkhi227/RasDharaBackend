const mongoose = require("mongoose")
const colors = require("colors")
require("dotenv").config()

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected to DB");      
    } catch (error) {
        console.log('error in connecting database',colors.bgRed);       
    }
}

module.exports = connectDB;