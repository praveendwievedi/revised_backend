import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {apiError} from '../utils/apiError.js'
import {User} from "../models/user.models.js"
import {uploadFileOnCloudinary} from "../utils/cloudinary.js"

const generateAccessTockenAndRefreshToken= async (userId)=>{
    
    try {
        const user= await User.findById(userId)
        const accessToken= await user.generateAccessTokens()
        const refreshToken= await user.generateRefreshTokens()
        
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return {refreshToken,accessToken}
    } catch (error) {
        throw new apiError(500,"something went wrong while generating access and refresh tokens")
    }
}

const registerUser=asyncHandler(async(req,res)=>{
    // take the data from the frontend
    // validate the data
    // check if the user already exists
    // take the avatar from the frontend
    // save it to the cloudinary 
    // add the url to the database
    // return the response
    const {userName , fullName , email, password}=req.body;
    if(
        [userName,fullName,email,password].some((field)=> field?.trim() ===" ")
        || (!fullName)
        ||(!password)
    ){
        throw new apiError(400,"All fields are required")
    }
    
    // console.log(userName);
    
    const existedUser=await User.findOne({
        $or:[{userName},{email}]
    })
    // console.log(existedUser);
    
    if(existedUser){
        // res.send(existedUser)
        throw new apiError(409,"User already exists")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path
    const coverImageLocalPath=req.files?.coverImage[0]?.path
    
    if(!avatarLocalPath){
        throw new apiError(400,"Avatar is required")
    }

    const avatar=uploadFileOnCloudinary(avatarLocalPath)
    const coverImage=uploadFileOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new apiError(400,"avatar required")
    }

    const user=await  User.create({
        userName,
        fullName,
        email,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url
    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreTockens" 
    )
    if(!createdUser){
        throw new apiError(500,"Something went error")
    }

    res.status(201).json(
        new apiResponse(200,createdUser,"user registered successfully")
    )

})

const loginUser=asyncHandler(async(req,res)=>{
    // take input from the user
    // check if the input fields are not empty
    // check if the user exists 
    // if user exists then compare the passwords
    // if password is correct then generate a accesstoken and give it to the user
    //  return the deatails we got from the database

    const {userName , email, password}=req.body;

    if(!userName || !email ){
        throw new apiError(400,"username or email is required")
    }
    
    const user=await User.findOne({
        $or:[{userName},{email}]
    })

    if(!user){
        throw apiError(400,"invalid credentials")
    }

    const isPasswordValidate= await user.isPasswordCorrect(password)
    if(!isPasswordValidate){
        throw new apiError(403,"invalid password")
    }

    const {accessToken,refreshToken}=await generateAccessTockenAndRefreshToken(user._id)

    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false})
    
    const options={
        httpOnly:true,
        secure:true
    }
    res
    .status(200)
    .cookie("accesstoken",accessToken,options)
    .cookie("refreshtoken",refreshToken,options)
    .json(
        new apiResponse(
            200,
            {
                user:userName,refreshToken,accessToken
            },
            "user logged in successfully"
        )
    )

})

const logoutUser= asyncHandler(async(req,res)=>{
    // take user credentials from the request
    // find the user and update the refresh token\
    // erase the access and refresh token from the cookies
    // return a response to the user
    const userId= req.user._id
    await User.findByIdAndUpdate(
        userId,
        {
            $set:{
                refreshToken:"",
            }
        },
        {
            new:true
        }
    )
    
    const options={
        httpOnly:true,
        secure:true
    }
    res
    .status(200)
    .clearCookie("accesstoken",options)
    .clearCookie("refreshtoken",options)
    .json(new apiResponse(200,{},"user logged out"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}