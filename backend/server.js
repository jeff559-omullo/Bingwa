require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dataPackageRoutes = require("./routes/dataPackageRoutes");
const mpesaRoutes = require("./routes/mpesaRoutes");
// Use Routes


// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use("/api/packages", dataPackageRoutes);
app.use("/api/mpesa", mpesaRoutes);
// Basic Route
app.get("/", (req, res) => {
  res.send("Bingwa Data Purchase API Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
