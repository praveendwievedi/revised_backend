import mongoose, {Schema,Model} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema=new Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowerCase:true,
        index:true,// we use index to such things where we want to do search about anything..
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        // unique:true,
        trim:true,
        // lowerCase:true,
        index:true,
    },
    avatar:{
        type:String,// here we will takr cloudinary url
        required:true,
    },
    coverImage:{
        type:String,
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    refreshToken:{
        type:String
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ]
},{timestamps:true})

// here we use function keyword instead of arrow function because we have to use this keyword.
userSchema.pre("save", async function(next){
    if(!this.isModified("password"))return next()
    this.password= await bcrypt.hash(this.password,10);
    next()
})

// custom methods for our ease..
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessTokens=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            userName:this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshTokens=function(){
    
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema)