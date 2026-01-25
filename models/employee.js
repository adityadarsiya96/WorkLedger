const mongoose = require("mongoose");
const schema = mongoose.Schema;

const employeSchema = new schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    employeeCode:{
        type:String,
        required:true,
        unique:true
    },
    department:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    joiningDate:{
        type:Date,
        required:true,
        default:Date.now
    },
    status:{
        type:String,
        default:"Active"
    }

});

module.exports = mongoose.model("Employee",employeSchema)