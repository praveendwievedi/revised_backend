import mongoose from "mongoose";
// import  db_name  from "../constants.js"

const connectDB=async (db_name)=>{
    try {
        const connectionInstance= await mongoose.connect(`${process.env.MONGO_URL}/${db_name}`)

        //this thing we do for checking to which database we are connected as in production we have multiple databases
        console.log("Database connected !! ",connectionInstance.connection.host);
        
    } catch (error) {
        console.log("Connection to DataBase Failed !! ",error);
        process.exit(1)
    }
}


export default connectDB;