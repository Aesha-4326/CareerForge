const dns = require("dns");

// Use reliable DNS servers for MongoDB Atlas SRV resolution
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Trying to connect to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed!");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);

    process.exit(1);
  }
};

module.exports = connectDB;