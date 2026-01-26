const express = require("express");
const router = express.Router();
const {creatHr}  = require("../controllers/adminController")


router.post("/hr",creatHr)

module.exports = router;