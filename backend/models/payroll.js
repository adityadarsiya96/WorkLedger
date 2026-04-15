const mongoose = require("mongoose");
const schema = mongoose.Schema;

const payrollSchema = new schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    salaryStructureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Salary",
        required: true
    },
    month: {
        type: Number,
        min:1,
        max:12,
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