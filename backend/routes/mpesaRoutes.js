const express = require("express");
const { stkPush, mpesaCallback } = require("../controllers/mpesaController");

const router = express.Router();

router.post("/stkpush", stkPush);
router.post("/callback", mpesaCallback);

module.exports = router;
