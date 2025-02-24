import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
     // Example: you could build an aggregate or query based on the parameters here.
  // For now, this remains a placeholder.
  const videos = await Video.find(); // Replace with proper query logic as needed

  return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { tittle, description} = req.body
    const owner=req.user._id;
    if(!isValidObjectId(owner)){
        throw new ApiError(400,"must be logged in")
    }
    // TODO: get video, upload to cloudinary, create video
    const videolocalpath=req.files?.video[0]?.path;
    const thumbnaillocalpath=req.files?.thumbnail[0]?.path;
    if(!videolocalpath){
        throw new ApiError(400,"video file is required");

    }
    if(!thumbnaillocalpath){
        throw new ApiError(400,"Thumbnail file is required");
    }
    const cloudinaryvideo=await uploadOnCloudinary(videolocalpath)
    const thumbnail=await uploadOnCloudinary(thumbnaillocalpath);
    const duration = cloudinaryvideo.duration || 0;
    const video=await Video.create({videoFile:cloudinaryvideo.url,thumbnail:thumbnail.url,tittle,description,isPublished:true,owner})
    if(!video){
        throw new ApiError(500,"video creation failed")
    }
    return res.status(200).json(new ApiResponse(200,video,"Video created successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!isValidObjectId(videoId))
        {throw new ApiError(400,"Wrong video id")}

    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(500,"no video with this id")
    }
    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"invalid video id")
    }
    const {tittle,description}=req.body;
    if(!tittle || tittle.trim()===""){
        throw new ApiError(400,"tittle should give")
    }
    if(!description || description.trim()===""){
        throw new ApiError(400,"description should give")
    }
    const thumbnaillocalpath=req.file?.path;
    if(!thumbnaillocalpath){
        throw new ApiError(400,"thumbnail required")
    }
    const thumbnail=await uploadOnCloudinary(thumbnaillocalpath);
    if(!thumbnail.url){
        throw new ApiError(400,"thumbnail not uploaded on cloudinary")
    }
    const video=await Video.findByIdAndUpdate(videoId,{
        $set:{
            tittle,description,thumbnail:thumbnail.url
        }},{new:true}
    )
    if(!video){
        throw new ApiError(500,"video not updated")
    }
    return res.status(200).json(new ApiResponse(200,video,"video updated"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"invalid video id")
    }
    const video=await Video.findByIdAndDelete(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found");
      }
    return res.status(200).json(new ApiResponse(200,video,"video deleted"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"invalid video id")
    }
    const videostatus=await Video.findById(videoId)
    if (!videostatus) {
        throw new ApiError(404, "Video not found");
      }
    const ispublished=videostatus.isPublished;
    const video=await Video.findByIdAndUpdate(videoId,{
        $set:{
            ispublished:!ispublished
        }
    },{new:true})
    return res.status(200).json(new ApiResponse(200,video,"toogle published"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}