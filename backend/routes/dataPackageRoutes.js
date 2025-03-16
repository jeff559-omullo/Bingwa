const express = require("express");
const router = express.Router();

// Sample Data Packages (Replace with DB Data Later)
const dataPackages = [
  { id: 1, name: "1GB 1HOUR", price: 20 },
  { id: 2, name: "250MB 24HOURS", price: 20 },
  { id: 3, name: "1.25GB TII MIDNIGHT", price: 55},
  { id: 4, name: "2.5GB 3DAYS", price: 300 },
  { id: 5, name: "5GB 7DAYS", price: 500 },
  { id: 6, name: "10GB 30DAYS", price: 1000 },
  { id: 7, name: "20GB 30DAYS", price: 2000 },
  { id: 8, name: "Unlimited 24HOURS", price: 250 },
  { id: 9, name: "1GB 24HOURS", price: 99 },
];

// GET all data packages
router.get("/", (req, res) => {
  res.status(200).json(dataPackages);
});

// GET a specific data package by ID
router.get("/:id", (req, res) => {
  const packageId = parseInt(req.params.id);
  const selectedPackage = dataPackages.find((pkg) => pkg.id === packageId);
  
  if (!selectedPackage) {
    return res.status(404).json({ error: "Data package not found" });
  }
  
  res.status(200).json(selectedPackage);
});

module.exports = router;
