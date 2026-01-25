const mongoose = require("mongoose")

const database=async()=>{
    try {
        const uri = process.env.MONGO_URI
        if (!uri) {
            throw new Error("MONGO_URI is missing")
        }
        await mongoose.connect(uri)
        console.log("MongoDB connected")
    } catch (err) {
        console.error("DB connection failed:")
        process.exit(1)
    }
}
   



module.exports = database