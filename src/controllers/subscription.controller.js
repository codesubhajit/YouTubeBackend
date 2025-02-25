import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
     // Validate channelId
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }
    const isSubscribed=await Subscription.findOne({subscriber:req.user._id,channel:channelId})
    if(isSubscribed){
        await isSubscribed.remove();
        return res.status(200).json(new ApiResponse(200,null,"UnSubscribed"));
    }
    else{
        const subscribe=await Subscription.create({subscriber:req.user._id,channel:channelId})
        return res.status(200).json(new ApiResponse(200,subscribe,"Subscribed")); 
    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
     // Validate channelId
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }
    const subscriber=await Subscription.find({channel:channelId});
    if(!subscriber ||subscriber.length()===0){
        throw new ApiError(400,"no subscriber")
    }
    return res.status(200).json(new ApiResponse(200,subscriber,"subscriber list"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
     // Validate channelId
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid channel id");
  }
    const channel=await Subscription.find({subscriber:subscriberId});
    if(!channel ||channel.length()===0){
        throw new ApiError(400,"no channel subscribed")
    }
    return res.status(200).json(new ApiResponse(200,channel,"channel list"))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}