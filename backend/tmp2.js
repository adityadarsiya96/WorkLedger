const mongoose = require("mongoose");
const User = require("./models/User");

const uri = process.env.MONGO_URI;

async function run() {
  await mongoose.connect(uri);
  const falseActiveRaw = await User.find({ isActive: false });
  console.log("Users with isActive false:", falseActiveRaw.length, "Docs:", falseActiveRaw.map(u => u.name));
  
  const roleEmployee = await User.find({ role: "EMPLOYEE" });
  console.log("Users with role EMPLOYEE:", roleEmployee.length, "Docs:", roleEmployee.map(u => ({name: u.name, isActive: u.isActive})));
  
  process.exit(0);
}
run();
