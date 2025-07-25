const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const AdminModel = require("../server/models/adminModel")
require("dotenv").config();

// Seeding function
const seedAdmins = async () => {
  try {
    const admins = [
      {
        email: "montysorkhi227@gmail.com",
        phone: "9729013924",
        password: await bcrypt.hash("monty123", 10),
      },
      {
        email: "coding.official441@gmail.com",
        phone: "9306468015",
        password: await bcrypt.hash("tanii123", 10),
      },
    ];

    await AdminModel.deleteMany(); // Clear old admins
    await AdminModel.insertMany(admins);
    console.log("✅ Admins seeded successfully");
    process.exit();
  } catch (error) {
    console.log("❌ Error occurred while saving admin data:", error);
    process.exit(1);
  }
};

// Connect to DB and call seed
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    seedAdmins();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
