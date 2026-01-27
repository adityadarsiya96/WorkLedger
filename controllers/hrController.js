// controllers/hrController.js
const User = require("../models/User");
const employeeModel = require("../models/employee");


// @ts-ignore
module.exports.createEmployee = async (req, res) => {
    console.log("BODY", req.body);

  try {
    const {
      userId,
      employeecode,
      department,
      designation,
      joiningDate
    } = req.body;

    // 1️⃣ Validation
    if (!userId || !employeecode || !department || !designation || !joiningDate) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // 2️⃣ Check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 3️⃣ Ensure user is EMPLOYEE
    if (user.role !== "EMPLOYEE") {
      return res.status(400).json({
        message: "User is not an employee"
      });
    }

    // 4️⃣ Prevent duplicate employee
    const existingProfile = await employeeModel.findOne({ userId });
    if (existingProfile) {
      return res.status(409).json({
        message: "Employee profile already exists"
      });
    }

    // 5️⃣ Create employee profile
    const employee = await employeeModel.create({
      userId,
      employeecode,
      department,
      designation,
      joiningDate
    });

    // 6️⃣ Activate user
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
