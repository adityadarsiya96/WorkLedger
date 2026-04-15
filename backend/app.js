const express = require("express");
require("dotenv").config({ path: "./.env" });
const app = express();
const authRouter = require("./routes/authRouter")
const adminRouter = require("./routes/adminRouter")
const hrRouter = require("./routes/hrRouter")
const managerRouter = require("./routes/managerRouter")
const employeeRouter = require("./routes/employeeRouter")
const cookieParser = require("cookie-parser");
const cors = require("cors");
const database = require("./config/dbConfig")
const admin = require("./scripts/admin");


app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000","https://work-ledger-sigma.vercel.app","https://work-ledger-lilac.vercel.app"], 
  credentials: true 
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.use("/auth",authRouter)
app.use('/admin',adminRouter)
app.use("/hr",hrRouter)
app.use("/employee",employeeRouter)
app.use("/manager",managerRouter)

const startServer = async () => {
    try {
        await database();
        await admin();
        
        app.listen(port,()=>{
            console.log(`App listning on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to start server", err);
    }
};

startServer();