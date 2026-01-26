const express = require("express");
require("dotenv").config({ path: "./.env" });
const app = express();
const authRouter = require("./routes/authRouter")
const adminRouter = require("./routes/adminRouter")
const cookieParser = require("cookie-parser");
const database = require("./config/dbConfig")
const admin = require("./scripts/admin");


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
database()
admin()

app.use("/auth",authRouter)
app.use('/admin',adminRouter)



app.listen(port,()=>{
    console.log(`App listning on port ${port}`);
    
})