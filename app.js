const express = require("express");
require("dotenv").config({ path: "./.env" });
const app = express();
const cookieParser = require("cookie-parser");
const database = require("./config/dbConfig")


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
database()

app.get("/",(req, res)=>{
    res.send("Server is started");
});



app.listen(port,()=>{
    console.log(`App listning on port ${port}`);
    
})