// import mongoose from "mongoose";
import { db_name } from "./constants.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js"
import { app } from "./app.js";



// the reason behind adding the semicolon is to complete any line code before running this iifs
/*;( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/${db_name}`)
        console.log("DataBase connected");
        
    } catch (error) {
        console.log(
            "Error connecting to MongoDB",error
        )
    }
})()
    */

dotenv.config({
    path:"./env"
})

connectDB(db_name)
.then(()=>{
    app.listen(process.env.PORT || 4000 ,()=>(
        console.log()
    ))
    console.log(`⚙️ Server is running on port ${process.env.PORT || 4000}`)
})
.catch((err)=>{
    console.log("error connecting server : ",err)
})


