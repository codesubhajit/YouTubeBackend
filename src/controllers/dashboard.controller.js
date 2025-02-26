import mongoose, { isValidObjectId } from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {owner}=req.params;
    if(!isValidObjectId(owner)){
        throw new ApiError(400,"Should be valid channnel id");
    }
    // const video=await Video.find({owner})
    // const totalVideo=await video.count();
    // const subscription=await Subscription.find({channel:owner});
    // const totalSubscriber=subscription.count();
    // const likes=await Like.find({likedBy:owner})
    // const totalLikes=await likes.count();
    const totalVideo = await Video.countDocuments({ owner });
    const totalSubscriber = await Subscription.countDocuments({ channel: owner });
    const totalLikes = await Like.countDocuments({ likedBy: owner });
     const videos = await Video.find({ owner });
  const totalViews = videos.reduce((acc, video) => acc + (video.views || 0), 0);
    // if(!video || !subscription || !likes){
    //     throw new ApiError(500,"Error fetching details")
    // }
return res.status(200).json(new ApiResponse(200,{totalLikes,totalSubscriber,totalVideo,totalViews},"Fetched channel stats"))

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {owner}=req.params;
    if(!isValidObjectId(owner)){
        throw new ApiError(400,"Should be valid channnel id");
    }
    const videos=await Video.find({owner});
  
    return res.status(200).json(new ApiResponse(200,videos,"videos"))
})

export {
    getChannelStats, 
    getChannelVideos
    }