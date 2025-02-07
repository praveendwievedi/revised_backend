import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from '../models/video.models.js'
import {apiResponse} from '../utils/apiResponse.js'
import {uploadFileOnCloudinary,deleteFilesFromCloudinary} from "../utils/cloudinary.js"
import { apiError } from "../utils/apiError.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const pageNumber=parseInt(page);
    const limitNumber=parseInt(limit);

    // this is filter obkect to find the videos based on custom searches.
    const filter={};
    if(query){
        filter.$or=[
            {title:{$regex:query,$options:'i'}},
            {description:{$regex:query,$options:'i'}}
        ]
    }

    if(userId){
        filter.owner=userId
    }

    const sortOptions={};
    if(sortBy){
        sortOptions[sortBy]=sortType === 'desc' ? -1 : 1;
    }
    else{
        sortOptions.createdAt=-1; // sort them based on the creation date i.e . the latest video will be on top
    }

    const videos= await Video.find(filter)
                        .sort(sortOptions)
                        .skip((pageNumber -1)* limitNumber)
                        .limit(limitNumber)
    const totalVideos=await Video.countDocuments(filter);

    return res.status(200)
                .json(
                    new apiResponse(
                        {
                            statusCode:200,
                        data:{
                            videos,
                            totalPages: Math.ceil(totalVideos/limitNumber),
                            currentPage:pageNumber,
                            totalVideos
                        },
                        message:"Videos fetched successfully"}
                    )
                )

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    // first we will take local path from the the request body
    // wait till the file is being uploaded to cloudinary 
    // take the required details from the cloudinary response
    // save it to the use which we will fetech from the request body
    const videoLocalPath=req.files?.video[0].path;
    const thumbnailLocalPath=req.files?.thumbnail[0].path;
    // console.log(req.files);
    
    if(!(videoLocalPath || thumbnailLocalPath)){
        throw new apiError(400, "need video and thumbnail both for uploading the vidoe");
    }
    const cloudVideoResponse=await uploadFileOnCloudinary(videoLocalPath);
    const cloudThubnailResponse=await uploadFileOnCloudinary(thumbnailLocalPath)
    if(!(cloudThubnailResponse || cloudVideoResponse)){
        throw new apiError(500, "something went wrong while uploading the video");
    }
    // console.log(cloudinaryResponse);
    
    const video=await Video.create({
        videoFile:cloudVideoResponse.url,
        thumbnail:cloudThubnailResponse.url,
        title,
        description,
        owner:req.user?._id,
        duration:cloudVideoResponse.duration
    })

    res.status(200)
        .json(
            new apiResponse(
                200,
                video,
                "Video uploaded successfully"
            )
        )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video=await Video.findById(videoId);
    if(!video){
        throw new apiError(404, "Video not found")
    }
    res.status(200)
        .json(
            new apiResponse(
                200,
                video,
                "Video found successfully"
            )
        )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    // const video=await Video.findById(videoId);
    // if(!video){
    //     throw new apiError(404, "Video not found")
    // }
    const updatedVideoLocalPath=req.files?.video[0].path;
    const updatedThumbnailLocalPath=req.files?.thumbnail[0].path;
    const { title, description } = req.body;
    if(!(updatedVideoLocalPath && updatedThumbnailLocalPath)){
        throw new apiError(404,"thumbnail and video both are required")
    }
    const updatedVideoCloud=await uploadFileOnCloudinary(updatedVideoLocalPath);
    const updatedThumbnailCloud=await uploadFileOnCloudinary(updatedThumbnailLocalPath);
    if(!(updatedVideoCloud && updatedThumbnailCloud)){
        throw new apiError(500,"unable to upload video on cloudinary");
    }

    const video=await Video.findByIdAndUpdate(videoId,{
        $set:{
            title:title || video.title,
            description:description || video.description,
            video:updatedVideoCloud.url,
            thumbnail:updatedThumbnailCloud.url
        }
    });
    res.status(200)
        .json(
            new apiResponse(
                200,
                video,
                "Video updated successfully"
            )
        )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const video=await Video.findById(videoId);
    if(!video){
        throw new apiError(404,"video not found");
    }
    const videoCloudUrl=video.videoFile.split('/').pop().split('.')[0];
    const thumbnailCloudUrl=video.thumbnail.split('/').pop().split('.')[0];
    const deletedVideoCloud=await deleteFilesFromCloudinary(videoCloudUrl,'video');
    const deletedThumbnailCloud=await deleteFilesFromCloudinary(thumbnailCloudUrl);
    // console.log(deletedVideoCloud);
    
    if(!(deletedVideoCloud && deletedThumbnailCloud)){
        throw new apiError(500,"unable to delete video from cloudinary");
    }
    await Video.findByIdAndDelete(videoId);
    res.status(200)
        .json(
            new apiResponse(
                200,
                {},
                "Video deleted successfully"
            )
        )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video=await Video.findByIdAndUpdate(videoId,{
        $set:{
            isPublished: !isPublished
        }
    });
    res.status(200)
        .json(
            new apiResponse(
                200,
                video,
                "Video published status updated successfully"
            )
        )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}