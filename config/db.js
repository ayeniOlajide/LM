require("dotenv").config();

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.log(error)
    }
};

module.exports = connectDB

 

