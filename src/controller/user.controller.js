import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {apiError} from '../utils/apiError.js'
import {User} from "../models/user.models.js"
import {uploadFileOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"

const generateAccessTockenAndRefreshToken= async (userId)=>{
        
    try {
        const user= await User.findById(userId)
        const accessToken= await user.generateAccessTokens()
        const refreshToken= await user.generateRefreshTokens()
        
        return {refreshToken,accessToken}
    } 
    catch (error) {
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
    // console.log(req.body);
    
    const {userName , fullName , email, password}=req.body;
    if(
        [userName,fullName,email,password].some((field)=> field?.trim() ===" ")
        || (!fullName)
        || (!password)
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
    
    // console.log(avatarLocalPath);

    if(!avatarLocalPath){
        throw new apiError(400,"Avatar is required")
    }

    const avatar = await uploadFileOnCloudinary(avatarLocalPath)
    const coverImage = await uploadFileOnCloudinary(coverImageLocalPath)
    // console.log(avatar);
    
    if(!avatar){
        throw new apiError(400,"avatar required")
    }
    // console.log(avatar);
    
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
    // console.log(createdUser);
    
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
    // console.log(req.body);
    const {userName , email, password}=req.body;
    
    if(!userName && !email ){
        throw new apiError(400,"username or email is required")
    }
    
    const user=await User.findOne({
        $or:[{userName},{email}]
    })

    if(!user){
        throw new apiError(400,"invalid credentials")
    }

    const isPasswordValidate= await user.isPasswordCorrect(password)
    if(!isPasswordValidate){
        throw new apiError(403,"invalid password")
    }
    // console.log(user);
    
    const {accessToken,refreshToken}=await generateAccessTockenAndRefreshToken(user._id)

    const newUser=await User.findByIdAndUpdate(
        user._id,
        {
            $set:{
                refreshToken
            }
        },
        {new:true}
    ).select("-password")

    // // console.log(user);
    // console.log(newUser);
    
    
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
                user:userName,email,refreshToken,accessToken
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
                refreshTokens:"",
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

const refreshAccessToken=asyncHandler(async(req,res)=>{
    // take the refresh token from the request 
    // decode the refresh token 
    // after decoding use the decoded info to find the user
    // take the refres token of the user and compare
    // after comparing , then generate a new access and refreshtoken 
    // return the response

    const incomingRefreshToken=req.cookies?.refreshtoken  || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new apiError(401, "no refresh token")
    }
    const decodedToken=jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )

    const user=await User.findById(decodedToken?._id)
    
    // console.log(user);
    
    if(!user){
        throw new apiError(401,"invalid refresh token")
    }

    if(incomingRefreshToken !==user.refreshToken){
        throw new apiError(401,"refresh token are used or expired")
    }
    const {accessToken}=await generateAccessTockenAndRefreshToken(user._id)

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accesstoken",accessToken,options)
    .cookie("refrestoken",user.refreshToken,options)
    .json(
        new apiResponse(
            200,
            {accessToken,refresToke:user.refreshToken},
            "access token refreshed successfully"
        )
    )
})

const updateUserPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body;
    const user=await User.findById(req.user?._id);
    const isOldPasswordCorrect=await user.isPasswordCorrect(oldPassword);
    if(!isOldPasswordCorrect){
        throw new apiError(400,"wrong password")
    }
    user.password=newPassword;
    await user.save({validateBeforeSave:false});
    res
    .status(200)
    .json(
        new apiResponse(
            201,
            {},
            "password updated successfully"
        )
    )
})

const updateUserAvatar=asyncHandler(async(req,res)=>{
    const avatarLocalPath=req.file?.path;
    if(!avatarLocalPath){
        throw new apiError(400,"no files uploaded")
    }
    const avatar=await uploadFileOnCloudinary(avatarLocalPath);
    if(!avatar){
        throw new apiError(400,"failed to upload avatar")
    }
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar?.url
            }
        },
        {new:true}
    ).select("-password -refreshToken")
    res.status(200)
    .json(
        new apiResponse(
            201,
            {user},
            "avatar updated successfully"
        )
    )
})

const getCurrentUser=asyncHandler((req,res)=>{
    res
    .json(
        new apiResponse(
            200,
            {user:req.user},
            "user retrieved successfully"
        )
    )
})

const getChannelDetails=asyncHandler(async(req,res)=>{
    // console.log(req.body);
    
    const {userName}=req.params?.username || req.body;
    console.log(userName);
    
    const channelDetails=await User.aggregate([
        {
        $match:{
            userName:userName
        }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },{
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },{
            $addFields:{
                $subscribersCount:{
                    $size:"$subscribers"
                },
                $subscribedToChannelCount:{
                    $size:"$subscribedTo"
                },
                $isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },{
            $project:{
                _id:1,
                fullName:1,
                userName:1,
                avatar:1,
                coverImage:1,
                email:1,
                subscribedTo:1,
                subscribers:1,
                isSubscribed:1
            }
        }
    ]
    )
    
    res.status(200).json(new apiResponse(200,channelDetails[0],"username retrieved successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateUserPassword,
    updateUserAvatar,
    getCurrentUser,
    getChannelDetails
}