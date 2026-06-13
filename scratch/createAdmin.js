const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const envPath = path.resolve(__dirname, "../.env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const uriMatch = envContent.match(/MONGODB_URI=(.*)/);
const MONGODB_URI = uriMatch ? uriMatch[1] : null;

async function run() {
  if (!MONGODB_URI) throw new Error("No MONGODB_URI found");
  await mongoose.connect(MONGODB_URI, { family: 4 });
  console.log("Connected to MongoDB.");
  
  const hashedPassword = await bcrypt.hash("argam21", 10);
  
  const db = mongoose.connection.collection("users");
  const existing = await db.findOne({ email: "argamthahir21@gmail.com" });
  if (existing) {
    console.log("User already exists. Updating role and password...");
    await db.updateOne(
      { email: "argamthahir21@gmail.com" },
      { $set: { role: "admin", password: hashedPassword } }
    );
  } else {
    console.log("Creating new admin user...");
    await db.insertOne({
      name: "Admin Argam",
      email: "argamthahir21@gmail.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  console.log("Admin setup complete!");
  mongoose.disconnect();
}
run();
