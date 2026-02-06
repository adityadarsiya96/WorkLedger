const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeProfile",
      required: true,
      index: true
    },

    basic: {
      type: Number,
      required: true,
      min: 0
    },

    hra: {
      type: Number,
      default: 0,
      min: 0
    },

    allowances: {
      type: Number,
      default: 0,
      min: 0
    },

    deductions: {
      pf: { type: Number, default: 0, min: 0 },
      tax: { type: Number, default: 0, min: 0 },
      other: { type: Number, default: 0, min: 0 }
    },

    effectiveFrom: {
      type: Date,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
)


salarySchema.index(
  { employeeId: 1, isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
)


salarySchema.virtual("grossSalary").get(function () {
  return this.basic + this.hra + this.allowances;
})


salarySchema.virtual("netSalary").get(function () {
  const totalDeductions =
    (this.deductions?.pf || 0) +
    (this.deductions?.tax || 0) +
    (this.deductions?.other || 0);

  return this.grossSalary - totalDeductions
})

salarySchema.set("toJSON", { virtuals: true })
salarySchema.set("toObject", { virtuals: true })

module.exports = mongoose.model("Salary", salarySchema)
