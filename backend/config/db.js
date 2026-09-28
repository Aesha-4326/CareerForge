const dns = require("dns");
const mongoose = require("mongoose");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const atlasHosts = [
  "ac-2w1cuqt-shard-00-00.9pqkzhn.mongodb.net",
  "ac-2w1cuqt-shard-00-01.9pqkzhn.mongodb.net",
  "ac-2w1cuqt-shard-00-02.9pqkzhn.mongodb.net"
];

const getConnectionUri = () => {
  const sourceUri = process.env.MONGO_URI;
  const match = sourceUri?.match(/^mongodb\+srv:\/\/([^@]+)@([^/?]+)(\/[^?]*)?(\?.*)?$/);

  if (!match || match[2].toLowerCase() !== "careerforge-db.9pqkzhn.mongodb.net") {
    return sourceUri;
  }

  const options = new URLSearchParams((match[4] || "").replace(/^\?/, ""));
  options.set("authSource", options.get("authSource") || "admin");
  options.set("replicaSet", "atlas-vsnkcg-shard-0");
  options.set("tls", "true");

  const hosts = atlasHosts.map((host) => `${host}:27017`).join(",");
  return `mongodb://${match[1]}@${hosts}${match[3] || "/"}?${options.toString()}`;
};

const connectDB = async () => {
  while (mongoose.connection.readyState !== 1) {
    try {
      console.log("Trying to connect to MongoDB...");
      const conn = await mongoose.connect(getConnectionUri(), {
        serverSelectionTimeoutMS: 10000
      });
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
      console.error("MongoDB connection failed; retrying in 5 seconds.");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

module.exports = connectDB;