const express = require("express");
const router = express.Router();
const {createHr, getDashboardStats}  = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/protect");

router.post("/hr",protect,authorize("ADMIN"),createHr)
router.get("/dashboard-stats", protect, authorize("ADMIN"), getDashboardStats);

module.exports = router;