import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const registerUser=asyncHandler(async(req,res)=>{
    const varaible="pravven"
    res.status(200).json(
        new apiResponse(
            200,varaible,"connection is eastablished"
        )
    )
})

export {
    registerUser
}