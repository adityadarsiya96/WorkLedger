const express = require("express");
const { protect, authorize } = require("../middleware/protect");
const { viewTeam, viewTeamLeaves, approveLeave } = require("../controllers/managerController");
const router = express.Router();

router.get("/view-team",protect,authorize("MANAGER"),viewTeam);
router.get("/team-leaves",protect,authorize("MANAGER"),viewTeamLeaves);
router.post("/approve-leave",protect,authorize("MANAGER"),approveLeave);

module.exports = router;