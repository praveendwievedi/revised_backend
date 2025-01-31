import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const pageNumber=parseInt(page);
    const limitNumber=parseInt(limit);
    const comments = await Comment.find({videoId})
                                    .sort({createdAt: -1})
                                    .skip((pageNumber - 1) * limitNumber)
    const totalComments=comments.length;
    const totalPages=Math.ceil(totalComments/limitNumber);
    res.status(200)
        .json(
            new apiResponse(
                200,
                {
                comments,
                totalPages,
                totalComments,
                pageNumber,
                },
                "Comments retrieved successfully",
            )
        )
}) 

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body
    if(!content)throw new apiError(400,"Don't be able to do empty comments");
    const comment = await Comment.create({videoId, content})
    res.status(200)
        .json(
            new apiResponse(
                200,
                comment,
                "Comment added successfully",
            )
        )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body
    const comment=await Comment.findByIdAndUpdate(commentId,{
        $set:{
            content
        }
    },{new:true})
    if(!comment) throw new apiError(404,"Comment not found")
    res.status(200)
        .json(
            new apiResponse(
                200,
                comment,
                "Comment updated successfully",
            )
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}=req.params;
    const comment=await Comment.findByIdAndDelete(commentId)
    if(!comment)throw new apiError(400,'no such comments avilabele')
    res.status(200)
        .json(
            new apiResponse(
                200,
                comment,
                'comment deleted successfully'
            )
        )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }