// import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
// import {User} from "../models/user.models.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    const userId=req.user?._id;
    if(!content){
        throw new apiError(400,"content is must for a tweet");
    }
    const tweet=await Tweet.create({
        content,
        owner:userId
    })
    res.status(200)
        .json(
            new apiResponse(
                200,
                tweet,
                "tweet created successfully"
            )
        )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId=req.user?._id;
    const tweets=await Tweet.find({owner:userId})
    res.status(200)
        .json(
            new apiResponse(
                200,
                tweets,
                "tweets fetched succesfully"
            )
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}=req.params;
    const {content} = req.body;
    const tweet=await Tweet.findByIdAndUpdate({
        $set:{
            content
        }
    })
    res.status(200)
        .json(
            new apiResponse(
                200,
                tweet,
                "tweet updated successfully"
            )
        )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params;
    await Tweet.findByIdAndDelete(tweetId)
    res.status(200)
        .json(
            new apiResponse(
                200,
                {},
                "tweet deleted successfully"
            )
        )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}