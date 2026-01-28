const bcrypt = require("bcrypt");
const User = require("../models/User");

// @ts-ignore
module.exports.creatHr = async(req,res)=>{
     try {
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

   
    const hashedPassword = await bcrypt.hash(password, 12);

   
    const hrUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "HR",
      isActive: true  // HR is immediately active
    });

    
    res.status(201).json({
      success: true,
      message: "HR user created successfully",
      user: {
        id: hrUser._id,
        name: hrUser.name,
        email: hrUser.email,
        role: hrUser.role,
        isActive: hrUser.isActive
      }
    });

  } catch (error) {
    console.error("Create HR error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

