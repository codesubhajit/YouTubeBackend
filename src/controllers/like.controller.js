import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"not valid videoid")
    }
   const videoLike=await Like.findOne({video:videoId,likedBy:req.user._id});
if(videoLike){
    await videoLike.remove();
    return res.status(200).json(new ApiResponse(200,null,"video unliking"))
}
else{
   const videoLiking=await Like.create({video:videoId,likedBy:req.user._id}) 
    return res.status(200).json(new ApiResponse(200,videoLiking,"video liking"))
}
}) 

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"not valid comment id")
    }
    const isLiked=await Like.find({comment:commentId, likedBy:req.user._id});
    if(isLiked){
        await isLiked.remove();
        return res.status(200).json(ApiResponse(200,null,"unliking"))
    }
    else{
        const liking=await Like.create({comment:commentId, isLiked:req.user._id});
        return res.status(200).json(new ApiResponse(200,liking,"comment liked"))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"not valid tweetId")
    }
    const tweetLike=await Like.find({tweet:tweetId,isLiked:req.user._id});
    if(tweetLike){
        await tweetLike.remove();
        return res.status(200).json(new ApiResponse(200,null,"unliking"))
    }
    else{
        const liketweet=await Like.create({tweet:tweetId,isLiked:req.user._id});
        return res.status(200).json(new ApiResponse(200,liketweet,"Liking"))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id;
    const likedVideos = await Like.find({ video: { $ne: null }, likedBy: userId })
      .populate("video"); // populate video details if needed
  
    return res
      .status(200)
      .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}