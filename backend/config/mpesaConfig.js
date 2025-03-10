require("dotenv").config();

module.exports = {
  CONSUMER_KEY: process.env.CONSUMER_KEY,
  CONSUMER_SECRET: process.env.CONSUMER_SECRET,
  SHORTCODE: process.env.SHORTCODE,  // Your Bingwa Sokoni Till Number
  PASSKEY: process.env.PASSKEY,      // M-Pesa Passkey
  CALLBACK_URL: process.env.CALLBACK_URL,  // Your callback URL
};
