const express = require("express")
const { protect, authorize } = require("../middleware/protect")
const router = express.Router()
const {createEmployee,showEmployee,showRequest} = require("../controllers/hrController")

router.post("/create-employee",protect,authorize("HR"),createEmployee)
router.get("/show-employee",protect,authorize("HR"),showEmployee)
router.get("/show-request",protect,authorize("HR"),showRequest)

module.exports = router



