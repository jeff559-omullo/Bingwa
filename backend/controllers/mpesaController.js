const axios = require("axios");
const moment = require("moment");
const Transaction = require("../models/Transaction"); // Import Model
require("dotenv").config();

const {
  DARAJA_CONSUMER_KEY,
  DARAJA_CONSUMER_SECRET,
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
  MPESA_CALLBACK_URL,
} = process.env;

// Get OAuth Token
const getOAuthToken = async () => {
  try {
    const auth = Buffer.from(`${DARAJA_CONSUMER_KEY}:${DARAJA_CONSUMER_SECRET}`).toString("base64");
    const { data } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );
    
    if (!data.access_token) throw new Error("Failed to retrieve access token");
    return data.access_token;
  } catch (error) {
    console.error("❌ OAuth Token Error:", error.response ? error.response.data : error.message);
    throw new Error("Failed to get OAuth token");
  }
};

// STK Push Function
const stkPush = async (req, res) => {
  const { phoneNumber, amount } = req.body;

  if (!phoneNumber || !amount) {
    return res.status(400).json({ error: "Phone number and amount are required" });
  }

  try {
    const access_token = await getOAuthToken();
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString("base64");

    const requestData = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: "Bingwa Data",
      TransactionDesc: "Data Purchase",
    };

    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      requestData,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!data.CheckoutRequestID) {
      console.error("❌ STK Push Error Response:", data);
      throw new Error("STK Push request failed");
    }

    // Save transaction in MongoDB
    const transaction = new Transaction({
      phoneNumber,
      amount,
      transactionId: data.CheckoutRequestID,
      status: "Pending",
    });
    await transaction.save();

    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ STK Push Error:", error.response ? error.response.data : error.message);
    return res.status(500).json({ error: "STK Push Request Failed" });
  }
};

// Callback Function
const callback = async (req, res) => {
  console.log("📞 M-Pesa Callback Received:", JSON.stringify(req.body, null, 2));

  if (!req.body.Body || !req.body.Body.stkCallback) {
    return res.status(400).json({ error: "Invalid callback data" });
  }

  const { CheckoutRequestID, ResultCode, ResultDesc } = req.body.Body.stkCallback;

  try {
    const transaction = await Transaction.findOne({ transactionId: CheckoutRequestID });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    transaction.status = ResultCode === 0 ? "Completed" : "Failed";
    transaction.resultDesc = ResultDesc;
    await transaction.save();

    return res.status(200).json({ message: "Transaction updated", status: transaction.status });
  } catch (error) {
    console.error("❌ Error updating transaction:", error.message);
    return res.status(500).json({ error: "Failed to update transaction" });
  }
};

module.exports = { stkPush, callback };
