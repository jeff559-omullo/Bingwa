const express = require("express");
const axios = require("axios");
const router = express.Router();
const Transaction = require("../models/Transaction"); // Assuming you store transactions in MongoDB

// Safaricom API Credentials
const CONSUMER_KEY = process.env.DARAJA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.DARAJA_CONSUMER_SECRET;
const SHORTCODE = process.env.MPESA_SHORTCODE;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL;

// Function to Get OAuth Token
const getOAuthToken = async () => {
  try {
    const response = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate", {
      auth: { username: CONSUMER_KEY, password: CONSUMER_SECRET },
      params: { grant_type: "client_credentials" },
    });
    return response.data.access_token;
  } catch (error) {
    console.error("❌ OAuth Token Error:", error.response?.data || error.message);
    throw new Error("Failed to get OAuth token");
  }
};

// STK Push Request
router.post("/stkpush", async (req, res) => {
  try {
    const { phone, amount, packageId } = req.body;
    const token = await getOAuthToken();

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: SHORTCODE,
        Password: new Buffer.from(SHORTCODE + process.env.MPESA_PASSKEY + new Date().toISOString().replace(/[-:]/g, "").slice(0, -5)).toString("base64"),
        Timestamp: new Date().toISOString().replace(/[-:]/g, "").slice(0, -5),
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: CALLBACK_URL,
        AccountReference: "Bingwa Data",
        TransactionDesc: `Data Purchase Package ${packageId}`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Store transaction in MongoDB
    await Transaction.create({ phone, amount, packageId, status: "Pending" });

    res.json({ success: true, message: "STK Push Initiated", response: response.data });
  } catch (error) {
    console.error("❌ STK Push Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: "STK Push Failed" });
  }
});

// Handle Callback from Safaricom
router.post("/stkpush/callback", async (req, res) => {
  const { Body } = req.body;
  const resultCode = Body?.stkCallback?.ResultCode;
  const checkoutRequestId = Body?.stkCallback?.CheckoutRequestID;

  if (resultCode === 0) {
    // Payment was successful, find transaction and update status
    const transaction = await Transaction.findOneAndUpdate(
      { checkoutRequestId },
      { status: "Success" },
      { new: true }
    );

    if (transaction) {
      console.log("✅ Payment Verified, Automating Data Purchase...");
      automateDataPurchase(transaction.phone, transaction.packageId);
    }
  } else {
    console.error("❌ Payment Failed:", Body?.stkCallback?.ResultDesc);
  }

  res.sendStatus(200);
});

module.exports = router;
