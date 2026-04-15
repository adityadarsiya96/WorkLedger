// controllers/hrController.js
const User = require("../models/User");
const employeeModel = require("../models/employee");
const Leave = require("../models/leave")
const Salary = require("../models/Salary")
const Payroll = require("../models/payroll")


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

    const employees = await employeeModel.find().populate({
        path: "userId", 
        select: "name email role manager",
        populate: { path: "manager", select: "name" }
    });


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
module.exports.showRequest = async (req, res) => {
  try {
    const waitingEmployee = await User.find({ role: "EMPLOYEE", isActive: false })
    if (waitingEmployee && waitingEmployee.length > 0) {
      return res.status(200).json({
        success: true,
        count: waitingEmployee.length,
        data: waitingEmployee
      })
    }
    else {
      return res.json({
        success: true,
        message: "No pending request"
      });
    }

  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      // @ts-ignore
      error: error.message
    });
  }
}

// @ts-ignore
module.exports.showLeave = async (req, res) => {
  try {
    let leaves = await Leave.find()
    if (leaves && leaves.length > 0) {
      res.status(200).json({
        success: true,
        count: leaves.length,
        data: leaves
      })
    }
    else {
      res.json({
        success: "true",
        message: "No pending request"
      })
    }


  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: true,
      message: "Internal Server Error"
    })

  }
}
// @ts-ignore
module.exports.approveLeave = async (req, res) => {
  try {
    let { leaveId, status } = req.body;
    if (!leaveId || !status) {
      return res.status(400).json({ message: "leaveId and status are required" });
    }
    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "Leave record not found" });
    }
    leave.status = status;
    leave.approvedBy = req.user._id;
    await leave.save();
    return res.status(200).json({
      success: true,
      message: `Leave ${status} successfully`,
      data: leave
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Internal Server Error", error: err.message });
  }
}
// @ts-ignore
module.exports.createManager = async (req, res) => {
  const { employeeId } = req.params;


  try {

    const employee = await employeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }


    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    if (user.role !== "EMPLOYEE") {
      return res.status(400).json({
        message: `User is already ${user.role}`
      });
    }


    user.role = "MANAGER";
    await user.save();

    return res.status(200).json({
      message: "Employee promoted to Manager successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error"
    });
  }
};
// module.exports.assignManager = async(req,res)=>{
//   try{
//     const { employeeId, managerId } = req.body
//     const employee = await User.findById(employeeId)
//     const manager = await User.findById(managerId)
//     if (!employeeId || !managerId) {
//       return res.status(400).json({ message: "EmployeeId and ManagerId required" })
//     }
//     if (!employee || !manager) {
//       return res.status(404).json({ message: "User not found" })
//     }
//     if (employee.role !== "EMPLOYEE") {
//       return res.status(400).json({ message: "Only employees can be assigned managers" })
//     }

//     if (manager.role !== "MANAGER") {
//       return res.status(400).json({ message: "Selected user is not a manager" })
//     }

//     employee.manager = manager._id;
//     await employee.save()

//     res.status(200).json({
//       message: "Manager assigned successfully",
//       employee: {
//         id: employee._id,
//         name: employee.name,
//         manager: manager.name
//       }
//     })

//   }
//   catch(err){
//     console.log(err)
//   }

// }

module.exports.assignManager = async (req, res) => {
  try {
    const { employeeId, managerId } = req.body;

    if (!employeeId || !managerId) {
      return res.status(400).json({
        message: "EmployeeId and ManagerId required"
      });
    }


    const employeeDoc = await employeeModel.findById(employeeId);
    const managerDoc = await employeeModel.findById(managerId);

    if (!employeeDoc || !managerDoc) {
      return res.status(404).json({ message: "Employee not found" });
    }


    const employee = await User.findById(employeeDoc.userId);
    const manager = await User.findById(managerDoc.userId);

    if (!employee || !manager) {
      return res.status(404).json({ message: "User not found" });
    }

    if (employee.role !== "EMPLOYEE") {
      return res.status(400).json({
        message: "Only employees can be assigned managers"
      });
    }

    if (manager.role !== "MANAGER") {
      return res.status(400).json({
        message: "Selected user is not a manager"
      });
    }


    employee.manager = manager._id;
    await employee.save();

    return res.status(200).json({
      message: "Manager assigned successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        manager: manager.name
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};
module.exports.defineSalary = async (req, res) => {
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


module.exports.runMonthlyPayroll = async (req, res) => {
  try {
    const { month, year } = req.body;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required"
      });
    }

    const alreadyRun = await Payroll.findOne({ month, year });
    if (alreadyRun) {
      return res.status(409).json({
        success: false,
        message: `Payroll already generated for ${month}/${year}`
      });
    }


    const salaries = await Salary.find({ isActive: true });

    if (!salaries.length) {
      return res.status(404).json({
        success: false,
        message: "No active salary records found"
      });
    }


    const payrollDocs = salaries.map(salary => ({
      employeeId: salary.employeeId,
      salaryStructureId: salary._id,
      month,
      year,
      netPay: salary.netSalary,
      generatedBy: req.user.id
    }));


    await Payroll.insertMany(payrollDocs);

    res.status(201).json({
      success: true,
      message: `Payroll generated successfully for ${month}/${year}`,
      totalEmployeesPaid: payrollDocs.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports.getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await employeeModel.countDocuments();
    const pendingRequests = await User.countDocuments({ role: "EMPLOYEE", isActive: false });

    // Attempting to match variations of pending status
    const leaveRequests = await Leave.countDocuments({
      status: { $regex: /pending/i }
    });

    const date = new Date();
    const currentMonth = date.getMonth() + 1; // 1-12 matching Payroll schema
    const currentYear = date.getFullYear();

    const payrollRun = await Payroll.findOne({ month: currentMonth, year: currentYear });

    res.status(200).json({
      success: true,
      stats: {
        totalEmployees: totalEmployees || 0,
        pendingRequests: pendingRequests || 0,
        leaveRequests: leaveRequests || 0,
        payrollStatus: payrollRun ? 'Completed' : 'Pending'
      }
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports.getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate('employeeId', 'name email').sort({ generatedAt: -1 });
    res.status(200).json({ success: true, data: payrolls });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching payrolls", error: error.message });
  }
};