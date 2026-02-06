// controllers/hrController.js
const User = require("../models/User");
const employeeModel = require("../models/employee");
const Leave = require("../models/leave")
const Salary = require("../models/Salary")


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
// @ts-ignore
module.exports.createManager = async (req,res)=>{
  const {employeeId} = req.body
  try{
  const user = await User.findOne(employeeId)
  if(!user){ res.status(404).json({message:"User not found"})

  }
  if (user.role !== "EMPLOYEE") {
      return res.status(400).json({
        message: `User is already ${user.role}`
      });
    }
    user.role = "MANAGER";
    await user.save();
    res.status(200).json({
      message: "Employee promoted to Manager successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  }catch(err){
    console.log(err)
    res.status(200).json({
      status:true,
      message:"Internal Server Error"

    })
  }
}
module.exports.assignManager = async(req,res)=>{
  try{
    const { employeeId, managerId } = req.body
    const employee = await User.findById(employeeId)
    const manager = await User.findById(managerId)
    if (!employeeId || !managerId) {
      return res.status(400).json({ message: "EmployeeId and ManagerId required" })
    }
    if (!employee || !manager) {
      return res.status(404).json({ message: "User not found" })
    }
    if (employee.role !== "EMPLOYEE") {
      return res.status(400).json({ message: "Only employees can be assigned managers" })
    }

    if (manager.role !== "MANAGER") {
      return res.status(400).json({ message: "Selected user is not a manager" })
    }

    employee.manager = manager._id;
    await employee.save()

    res.status(200).json({
      message: "Manager assigned successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        manager: manager.name
      }
    })

  }
  catch(err){
    console.log(err)
  }

}
module.exports.defineSalary = async(req,res)=>{
  try {
    const {
      employeeId,
      basic,
      hra = 0,
      allowances = 0,
      deductions = {},
      effectiveFrom
    } = req.body;

    
    if (!employeeId || basic == null || !effectiveFrom) {
      return res.status(400).json({
        message: "employeeId, basic, and effectiveFrom are required"
      });
    }

    if (basic < 0 || hra < 0 || allowances < 0) {
      return res.status(400).json({
        message: "Salary values cannot be negative"
      });
    }

    
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    
    const activeSalary = await Salary.findOne({
      employeeId,
      isActive: true
    });

   
    if (activeSalary) {
      activeSalary.isActive = false;
      await activeSalary.save();
    }

    
    const newSalary = await Salary.create({
      employeeId,
      basic,
      hra,
      allowances,
      deductions: {
        pf: deductions.pf || 0,
        tax: deductions.tax || 0,
        other: deductions.other || 0
      },
      effectiveFrom,
      isActive: true,
      createdBy: req.user._id 
    });

    return res.status(201).json({
      message: "Salary structure defined successfully",
      salary: newSalary
    });

  } catch (error) {
    console.error("Define Salary Error:", error);

 
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An active salary structure already exists for this employee"
      });
    }

    return res.status(500).json({
      message: "Internal server error"
    });
  }



}