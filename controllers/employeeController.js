const User = require("../models/User")
const employeeModel = require("../models/employee")
const Leave = require("../models/leave")


// @ts-ignore
module.exports.viewProfil = async (req, res) => {
    console.log(req.body);
    try {
       
        let user = await User.findOne({ email: req.body.email });

        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
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
        const { employeeCode, type, startDate, endDate, reason } = req.body;

       
        if (!employeeCode || !type || !startDate || !endDate || !reason) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

   
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ success: false, message: "Invalid date format" });
        }

        if (end < start) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be earlier than start date"
            });
        }

      
        const employee = await employeeModel.findOne({ employeecode: employeeCode });
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found with the provided code"
            });
        }

        // 4. Create the Leave Record in the Database
        const leaveRequest = await Leave.create({
            employeId: employee._id,      
            employecode: employeeCode,     
            type,
            startDate: start,
            endDate: end,
            reason,
            status: "Pending"            
        });

        // 5. Final Success Response
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
    