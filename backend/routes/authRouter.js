const express = require("express");
const { protect } = require("../middleware/protect");
const { register, login, logout, getProfile } = require("../controllers/authController");
const router = express.Router();


router.post("/register",register);
router.post("/login",login);
router.get("/logout",logout);
router.get("/me", protect, getProfile);

module.exports = router;