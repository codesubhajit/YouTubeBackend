import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { json } from "express/lib/response.js"

const createTweet = asyncHandler(async (req, res) => {
    
    const content=req.body;
    const user=req.user;
    if(!user){
        throw new ApiError(404,"You must be logged in")
    }
    if(!content || content.trim()===""){
        throw new ApiError(401,"content can't blank")
    }
    const tweet= await Tweet.create({content:content,owner:user._id})
    if(!tweet){
        throw new ApiError(500,"tweet not saved")
    }
return res.status(201).json(new ApiResponse(201,tweet,"tweet created successfully"))

})

const getUserTweets = asyncHandler(async (req, res) => {
    const tweets=Tweet.find()
    if(!tweets || (await tweets).length===0){
        throw new ApiError(400,"no tweets ")
    }
    res.status(200).json(new ApiResponse(200,tweets,"tweet fetch successfully"))

})

const updateTweet = asyncHandler(async (req, res) => {
    const {id}=req.params
    const {content}=req.body;
    if(!isValidObjectId(id)){
        throw new ApiError(400,"invalid tweet id")
    }
    if(!content ||content.trim()===""){
        throw new ApiError(400,"content can't blank")
    }

    const updatecontent=await Tweet.findByIdAndUpdate(id,{
        $set:{
            content:content
        }
    },{new:true,runValidators:true})
    if(!updatecontent){
        throw new ApiError(400,"tweet not found")
    }
    return res.status(200).json(new ApiResponse(200,updatecontent,"content updated successfully"))
})


const deleteTweet = asyncHandler(async (req, res) => {
    const {id}=req.params;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid tweet ID");
    }
    const deletedTweet=Tweet.findByIdAndDelete(id)
    if (!deletedTweet) {
        throw new ApiError(404, "Tweet not found");
    }
    return res.status(200).json(new ApiResponse(200,deleteTweet,"Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}