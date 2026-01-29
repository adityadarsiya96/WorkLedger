const mongoose = require("mongoose");
const schema = mongoose.Schema;

const employeSchema = new schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    employeecode:{
        type:String,
        required:true,
        unique:true,
        
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
        
    },
    status:{
        type:String,
        enum: ["ACTIVE", "INACTIVE"],
        default:"ACTIVE"
    },
    

});

module.exports = mongoose.model("employee",employeSchema)