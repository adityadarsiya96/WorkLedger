// controllers/hrController.js
const User = require("../models/User");
const employeeModel = require("../models/employee");
const Leave = require("../models/leave")


// @ts-ignore
module.exports.createEmployee = async (req, res) => {

  try {
    const {
      userId,
      employeecode,
      department,
      designation,
      joiningDate
    } = req.body;

    
    if (!userId || !employeecode || !department || !designation || !joiningDate) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    
    if (user.role !== "EMPLOYEE") {
      return res.status(400).json({
        message: "User is not an employee"
      });
    }

   
    const existingProfile = await employeeModel.findOne({ userId });
    if (existingProfile) {
      return res.status(409).json({
        message: "Employee profile already exists"
      });
    }

   
    const employee = await employeeModel.create({
      userId,
      employeecode,
      department,
      designation,
      joiningDate
    });

    
    user.isActive = true;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Employee created and activated",
      employee
    });

  } catch (error) {
    console.error("Create employee error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// @ts-ignore
module.exports.showEmployee = async (req, res) => {
  try {
   
    const employees = await employeeModel.find();

   
    return res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });

  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      // @ts-ignore
      error: error.message 
    });
  }
};

// @ts-ignore
module.exports.showRequest = async (req,res) =>{
  try{
    const waitingEmployee = await User.find({role:"EMPLOYEE",isActive:false})
    if(waitingEmployee && waitingEmployee.length > 0){
      return res.status(200).json({
      success:true,
      count:waitingEmployee.length,
      data:waitingEmployee
    })
    }
    else{
      return res.json({
        success:"true",
        message:"No pending request"
      })
    
  }

  }catch(error){
    console.error("Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message:"Internal Server Error",
      // @ts-ignore
      error: error.message 
    });
  }
}

// @ts-ignore
module.exports.showLeave = async(req,res)=>{
  try{
    let leaves = await Leave.find()
    if(leaves && leaves.length>0){
      res.status(200).json({
        success:true,
        count:leaves.length,
        data:leaves
      })
    }
    else{
      res.json({
        success:"true",
        message:"No pending request"
      })
    }
    

  }catch(error){
    console.log(error)
    res.status(500).json({
      status:true,
      message:"Internal Server Error"
    })

  }
}
// @ts-ignore
module.exports.approveLeave =(req,res)=>{
  try{
    let {leaveId,status} = req.body
    console.log(leaveId,status)
    res.send("ok").status(200)
  }catch(err){
    console.log(err)
  }

}