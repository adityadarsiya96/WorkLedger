const mongoose = require("mongoose");
const schema = mongoose.Schema;

const leaveSchema = new schema({
    employeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employee", 
        required: true
    },
    employecode:{
        type:String,
        required:true

    },
    type:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        default:Date.now,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    isPaid: {
        type: Boolean,
        default: true
    },
    status:{
        type:String,
        default:"Pending"
    },
    reason:{
        type:String,
        required:true
    
    },
    approvedBy:{
        type:mongoose.Schema.Types.ObjectId,
         ref:"User"
        
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    leaveBalance: { 
        type: Number, 
        default: 20
    }

});

module.exports = mongoose.model("Leave",leaveSchema);

