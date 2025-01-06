import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

// we use .use to put a middleware to the app
//here we will configure the cors to set properly who can access our server
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
}))


app.use(cookieParser())
// here in we are conveying app about the type of data we are expecting.
app.use(express.json())
// here we are telling the app that we can also take data through url
//here the extended is used to decide the extent of parsing we need..
app.use(express.urlencoded({extended:true}))
// this will be used to access any static files 
app.use(express.static("public"))


// routes
import userRoutes from "./routers/user.router.js"

app.use('/user',userRoutes)

export {app}