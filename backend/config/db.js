
const mongoose = require("mongoose");

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from environment variables");
  }

  connectionPromise = mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "bestxworst",
    })
    .then((connection) => {
      console.log(`MongoDB connected: ${connection.connection.host}`);
      return connection.connection;
    })
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
};

module.exports = connectDB;
