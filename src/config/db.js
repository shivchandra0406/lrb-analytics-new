const mongoose = require("mongoose");
const Config = require("./config");

const connectDB = async () => {

  console.log("db connection",process.env.ENV);
  console.log(Config.getConfig().mongoUri);
  
  try {
    await mongoose.connect(Config.getConfig().mongoUri, {
      maxPoolSize: 10, // ✅ Connection pooling
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
