const express = require("express");
const { protect, authorize } = require("../middleware/protect");
const router = express.Router();
const {
  createEmployee,
  showEmployee,
  showRequest,
  showLeave,
  approveLeave,
  createManager,
  assignManager,
  defineSalary
} = require("../controllers/hrController");

router.post("/create-employee", protect, authorize("HR"), createEmployee);
router.get("/show-employee", protect, authorize("HR"), showEmployee);
router.get("/show-request", protect, authorize("HR"), showRequest);
router.get("/show-leave", protect, authorize("HR"), showLeave);
router.post("/approve-leave", protect, authorize("HR"), approveLeave);
router.put("/create-manager/:employeeId",protect,authorize("HR"),createManager,
);
router.put("/assign-manager",protect,authorize("HR"),assignManager)
router.post("/define-salary",protect,authorize("HR"),defineSalary)

module.exports = router;
