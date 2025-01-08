import {User} from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

const  userAuthenticate= asyncHandler(async (req,_,next)=>{
    try {
        const accessToken=req.cookies?.accesstoken || req.header.authorisation?.replace("Bearer ","")
        // console.log(accessToken);
        
        if(!accessToken){
            throw new apiError(400,"no access token")
        }
        const decodedToken= jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
        // console.log(decodedToken);
        
        const user=await User.findById(decodedToken._id).select("-password -refreshToken")
        if(!user){
            throw new apiError(400,"invalid accesstoken")
        }
        req.user= user
        next()
    } catch (error) {
        throw new apiError(400, error?.message || "invalid accesstoken")
    }   
} )

export default userAuthenticate;