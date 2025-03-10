const axios = require("axios");
const moment = require("moment");
const { CONSUMER_KEY, CONSUMER_SECRET, SHORTCODE, PASSKEY, CALLBACK_URL } = require("../config/mpesaConfig");

// Function to get M-Pesa access token
const getAccessToken = async () => {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  try {
    const response = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` },
    });
    return response.data.access_token;
  } catch (error) {
    console.error("M-Pesa Token Error:", error.response.data);
    throw new Error("Failed to get access token");
  }
};

// Function to trigger STK Push
const stkPush = async (req, res) => {
  const { phone, amount } = req.body;
  const timestamp = moment().format("YYYYMMDDHHmmss");
  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");

  try {
    const accessToken = await getAccessToken();

    const response = await axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: CALLBACK_URL,
      AccountReference: "BingwaData",
      TransactionDesc: "Buy Data",
    }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    res.json(response.data);
  } catch (error) {
    console.error("STK Push Error:", error.response.data);
    res.status(500).json({ message: "STK Push failed" });
  }
};

// M-Pesa Callback Function
const mpesaCallback = async (req, res) => {
  console.log("M-Pesa Callback Received:", req.body);
  res.sendStatus(200);
};

module.exports = { stkPush, mpesaCallback };
