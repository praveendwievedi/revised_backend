import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {apiError} from '../utils/apiError.js'
import User from "../models/user.models.js"
import {uploadFileOnCloudinary} from "../utils/cloudinary.js"

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
        [userName,fullName,email,password].some((field)=>field?.trim()==="")
    ){
        throw new apiError(400,"All fields are required")
    }
    
    const existedUser=User.findOne({
        $or:[{userName},{email}]
    })
    
    if(existedUser){
        throw new apiError(409,"User already exists")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path
    const coverImageLocalPath=req.files?.coverImage[0]?.path
    const avatar=uploadFileOnCloudinary(avatarLocalPath)
    const coverImage=uploadFileOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new apiError(400,"avatar required")
    }

    const user=new User({
        userName,
        fullName,
        email,
        password,
        avatar=avatar.url,
        coverImage=coverImage?.url
    })

    const createdUser=User.findById(user._id).select(
        "-password -refreTockens" 
    )
    if(!createdUser){
        throw new apiError(500,"Something went error")
    }

    res.status(201).json({
        new apiResponse({
            200,
            createdUser,
            "user created successfully"
        })
    })

})

export {
    registerUser
}