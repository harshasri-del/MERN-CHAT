

const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://Harshasri:Harsha@chat-app.hbfrglv.mongodb.net/?retryWrites=true&w=majority&appName=Chat-App');
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;
