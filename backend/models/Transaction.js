const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, unique: true },
  status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
