const User = require("../models/User");
const employeeModel = require("../models/employee");
const Leave = require("../models/leave")
const Salary = require("../models/Salary")
const Payroll = require("../models/payroll")

module.exports.viewTeam = async(req,res)=>{
    try {
        const managerId = req.user._id;

        const teamUsers = await User.find({ manager: managerId }).select("_id name email role status");
        const teamMemberIds = teamUsers.map(u => u._id);
        
        const teamProfiles = await employeeModel.find({ userId: { $in: teamMemberIds } })
                                                .populate('userId', 'name email status role');

        if (!teamProfiles || teamProfiles.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No team members found for this manager.",
                data: []
            });
        }

        res.status(200).json({
            success: true,
            count: teamProfiles.length,
            data: teamProfiles
        });

    } catch (err) {
        console.error("Get Team Members Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
}

module.exports.viewTeamLeaves = async(req,res)=>{
    try {
        const managerId = req.user._id;
        const teamUsers = await User.find({ manager: managerId }).select("_id");
        const teamUserIds = teamUsers.map(u => u._id);

        const leaves = await Leave.find({ employeId: { $in: teamUserIds } })
                                  .populate('employeId', 'name email')
                                  .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves
        });
    } catch (err) {
        console.error("View Team Leaves Error:", err);
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
}

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
      res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
}