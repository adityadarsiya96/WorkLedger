const express = require("express");
const router = express.Router();
const {creatHr}  = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/protect");


router.post("/hr",protect,authorize("ADMIN"),creatHr)

module.exports = router;