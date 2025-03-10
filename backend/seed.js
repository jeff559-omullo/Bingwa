require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const DataPackage = require("./models/DataPackage");

const seedData = async () => {
  await connectDB();

  const packages = [
    { name: "1.1GB (1 Hour)", size: "1.1GB", duration: "1 Hour", price: 20 },
    { name: "250MB (24 Hours)", size: "250MB", duration: "24 Hours", price: 20 },
    { name: "1.25GB (Till Midnight)", size: "1.25GB", duration: "Till Midnight", price: 55 },
  ];

  try {
    await DataPackage.deleteMany(); // Clear old data
    await DataPackage.insertMany(packages);
    console.log("Data Packages Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
