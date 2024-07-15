import dotenv from "dotenv"
import { app } from './app.js'
import { connectDB } from "./database/connectDb.js";

dotenv.config({
    path: '../.env'
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port :http://localhost:${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("mysql connection failed !!! ", err);
    })
