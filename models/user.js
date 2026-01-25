const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema  = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    roleId:{
        type:String,
        required:true
    
    },
    employeeId:{
        required:true,
        type:String,
        unique:true
    },
    isActive:{
        type:Boolean,
        default:false
    
    },
    createdAt:{
        type:Date,
        default:Date.now
    
    }


});

module.exports = mongoose.model("User",userSchema);