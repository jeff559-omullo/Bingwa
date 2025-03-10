const mongoose = require("mongoose");

const DataPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const DataPackage = mongoose.model("DataPackage", DataPackageSchema);
module.exports = DataPackage;
