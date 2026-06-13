const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");
  const users = await mongoose.connection.collection("users").find({}).toArray();
  console.log("Users:", users);
  mongoose.disconnect();
}
run();
