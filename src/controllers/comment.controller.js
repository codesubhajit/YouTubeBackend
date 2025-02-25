import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"video id wrong")
    }
    const {page = 1, limit = 10} = req.query
    const comments=await Comment.find({video:videoId}).skip((page - 1) * parseInt(limit))
    .limit(parseInt(limit));
    if(!comments || comments.length === 0){
        throw new ApiError(404,"Comments not found")
    }
    return res.status(200).json(new ApiResponse(200,comments,"comments fetched"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoid}=req.params;
    if(!isValidObjectId(videoid)){
        throw new ApiError(400,"video id wrong")
    }
    const {content}=req.body;
    if(!content || content.trim()===""){
        throw new ApiError(400,"No content")
    }
    const addcomment=await Comment.create({
        content,
        video: videoid,
        owner: req.user ? req.user._id : null,
      });
    if(!addComment){
        throw new ApiError(500,"Comment not added")
    }
    return res.status(200).json(new ApiResponse(200,addComment,"comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {id}=req.params;
    if(!isValidObjectId(id)){
        throw new ApiError(400,"comment id wrong")
    }
    const {content}=req.body;
    if(!content || content.trim()===""){
        throw new ApiError(400,"No content")
    }
    const updatedcomment=await Comment.findByIdAndUpdate(id,{
        $set:{
            content
        }
    },{new:true})
    if(!updateComment){
        throw new ApiError(500,"No comment updated")
    }
    return res.status(200).json(new ApiResponse(200,updateComment,"comment updated"))

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {id}=req.params;
    if(!isValidObjectId(videoid)){
        throw new ApiError(400,"comment id wrong")
    }
    const deleteComment=await Comment.findByIdAndDelete(id)

    if(!deleteComment){
        throw new ApiError(500,"No comment deleted")
    }
    return res.status(200).json(new ApiResponse(200,deleteComment,"comment deleted"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }