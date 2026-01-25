const mongoose = require("mongoose");
const schema = mongoose.Schema;

const payrollSchema = new schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    salaryStructureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SalaryStructure",
        required: true

    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true

    },
    netPay: {
        type: Number,
        required: true

    },
    generatedAt: {
        type: Date,
        default: Date.now

    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    }


});

module.exports = mongoose.model("Payroll", payrollSchema);