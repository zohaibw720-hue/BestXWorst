
const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from environment variables.");
  }

  return mongoose.connect(process.env.MONGO_URI, {
    dbName: "bestxworst",
    serverSelectionTimeoutMS: 10000,
  });
};

module.exports = connectDB;
