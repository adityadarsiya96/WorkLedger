const User = require("../models/User")
const employeeModel = require("../models/employee")
const Leave = require("../models/leave")
const Salary = require("../models/Salary")


// @ts-ignore
module.exports.viewProfile = async (req, res) => {
    try {
        let user = await User.findById(req.user._id).select('-password');
        let employeeInfo = await employeeModel.findOne({ userId: req.user._id });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                user,
                employeeInfo 
            }
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            // @ts-ignore
            message: error.message
        });
    }
};

// @ts-ignore
  module.exports.applyForLeave = async (req, res) => {
    try {
        const { type, startDate, endDate, reason } = req.body;

        if (!type || !startDate || !endDate || !reason) {
            return res.status(400).json({
                success: false,
                message: "Type, startDate, endDate and reason are required"
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ success: false, message: "Invalid date format" });
        }

        if (end < start) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be earlier than start date"
            });
        }

        const employee = await employeeModel.findOne({ userId: req.user._id });
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee profile not found. Please contact administration."
            });
        }

        const leaveRequest = await Leave.create({
            employeId: req.user._id,      
            employecode: employee.employeecode,     
            type,
            startDate: start,
            endDate: end,
            reason,
            status: "Pending"            
        });

        return res.status(201).json({
            success: true,
            message: "Leave applied successfully",
            data: leaveRequest
        });

    } catch (error) {
        console.error("Apply Leave Error:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred",
            error: error.message
        });
    }
};





module.exports.viewSalary = async(req,res)=>{
    try {
    const employeeId = req.user.id; 
    console.log(employeeId)

    const salary = await Salary.findOne({ employeeId });

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary not found"
      });
    }

    res.status(200).json({
      success: true,
      data: salary
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
    

}
module.exports.viewLeave = async(req,res)=>{
    try{
        const employeId = req.user._id;
        const leaves = await Leave.find({employeId}).sort({ createdAt: -1 });

        res.status(200).json({
          success: true,
          data: leaves || []
        });

    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

module.exports.viewPayroll = async(req,res)=>{
    try {
        const employeeId = req.user._id;
        const Payroll = require("../models/payroll");
        const payrolls = await Payroll.find({ employeeId }).sort({ generatedAt: -1 });

        res.status(200).json({
            success: true,
            data: payrolls || []
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports.cancelLeave = async(req,res)=>{
    try {
        const { id } = req.params;

        const deletedLeave = await Leave.findByIdAndDelete(id);
        if (!deletedLeave) {
            return res.status(404).json({
                success: false,
                message: "Leave record not found. It may have already been cancelled."
            });
        }
        res.status(200).json({
            success: true,
            message: "Leave application cancelled and removed successfully",
            deletedData: deletedLeave 
        });

    } catch (error) {
        console.error("Cancel Leave Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while cancelling the leave",
            error: error.message
        });
    }
}


