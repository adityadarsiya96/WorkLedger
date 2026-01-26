const bcrypt = require("bcrypt");
const User = require("../models/User")

async function admin() {
  const adminExists = await User.findOne({ role: "ADMIN" });

  if (!adminExists) {
    // @ts-ignore
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

    await User.create({
      name: process.env.ADMIN_NAME,
      // @ts-ignore
      email: process.env.ADMIN_MAIL,
      // @ts-ignore
      password: hashedPassword,
      role: "ADMIN",
      isActive: true
    });

    console.log("✅ Admin created");
  }
}

module.exports = admin;
