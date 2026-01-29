const express = require("express")
const { protect, authorize } = require("../middleware/protect")
const router = express.Router()
const {createEmployee,showEmployee,showRequest, showLeave, approveLeave} = require("../controllers/hrController")

router.post("/create-employee",protect,authorize("HR"),createEmployee)
router.get("/show-employee",protect,authorize("HR"),showEmployee)
router.get("/show-request",protect,authorize("HR"),showRequest)
router.get("/show-leave",protect,authorize("HR"),showLeave)
router.post("/approve-leave",protect,authorize("HR"),approveLeave)

module.exports = router



