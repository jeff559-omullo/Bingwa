require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const config = require('./config');

console.log("🔑 Consumer Key:", config.consumerKey);
console.log("🔒 Consumer Secret:", config.consumerSecret);

// Import Routes
const dataPackageRoutes = require("./routes/dataPackageRoutes");
const mpesaRoutes = require("./routes/mpesaRoutes");

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use("/api/datapackages", dataPackageRoutes); 
// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1); // Exit process with failure
  }
};

// Call the MongoDB connection function
connectDB();

// Routes
app.use("/api/packages", dataPackageRoutes);
app.use("/api/mpesa", mpesaRoutes);

// Basic Route
app.get("/", (req, res) => {
  res.send("Bingwa Data Purchase API Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

