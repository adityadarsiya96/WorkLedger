const express = require("express")
const router = express.Router()
const {protect,authorize} = require("../middleware/protect")
const {viewProfile,applyForLeave,viewSalary,cancelLeave,viewLeave,viewPayroll} = require("../controllers/employeeController")

router.get("/employeeProfile",protect,authorize("EMPLOYEE"),viewProfile)
router.post("/apply-leave",protect,authorize("EMPLOYEE"),applyForLeave)
router.get("/viewsalary",protect,authorize("EMPLOYEE","MANAGER"),viewSalary)
router.get("/viewLeave",protect,authorize("EMPLOYEE","MANAGER"),viewLeave)
router.get("/viewpayroll",protect,authorize("EMPLOYEE","MANAGER"),viewPayroll)
router.delete("/cancel-leave/:id",protect,authorize("EMPLOYEE","MANAGER"),cancelLeave)

module.exports = router 