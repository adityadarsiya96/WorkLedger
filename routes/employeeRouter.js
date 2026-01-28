const express = require("express")
const router = express.Router()
const {protect,authorize} = require("../middleware/protect")

router.get("/employeeDashbord",protect,authorize("EMPLOYEE"),(req,res)=>{
    res.send("Employee Router")
})


module.exports = router 