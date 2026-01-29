const express = require("express")
const router = express.Router()
const {protect,authorize} = require("../middleware/protect")
const {viewProfil,applyForLeave} = require("../controllers/employeeController")

router.get("/employeeProfile",protect,authorize("EMPLOYEE"),viewProfil)
router.post("/applyleave",protect,authorize("EMPLOYEE"),applyForLeave)


module.exports = router 