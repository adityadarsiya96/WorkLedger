const express = require("express")
const { protect, authorize } = require("../middleware/protect")
const router = express.Router()
const {createEmployee} = require("../controllers/hrController")

router.post("/create-employee",protect,authorize("HR"),createEmployee)



module.exports = router