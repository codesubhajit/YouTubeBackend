import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const owner=req.user._id;
    if(!name || name.trim()===""){
        throw new ApiError(404,"playlist name is required")
    }
    //TODO: create playlist
    if(!description || description.trim()===""){
        throw new ApiError(404,"playlist description is required")
    }
    if(!owner || isValidObjectId(owner)){
        throw new ApiError(400,"you must be logged in")
    }

    const playlist=await Playlist.create({name,description,owner});
    if(!playlist){
        throw new ApiError(500,"playlist not created");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id");
      }
    const playlist=await Playlist.find({owner:userId});
    if(!playlist || playlists.length === 0){
        throw new ApiError(400,"playlists not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlists fetched successfully"));

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const playlist=Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404,"playlists not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
    
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(isValidObjectId(playlistId)){
        throw new ApiError(400,"playlist id not valid")
    }
    if(isValidObjectId(videoId)){
        throw new ApiError(400,"video id not valid")
    }
    //fix add videos id in the array of video
    const playlist=await Playlist.findByIdAndUpdate(playlistId,{
        $push:{videos:videoId}
    },{new:true})
    if (!playlist) {
        throw new ApiError(500, "Failed to add video to playlist");
      }
      
      return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video added to playlist successfully"));

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(isValidObjectId(videoId)){
        throw new ApiError(400,"video id not valid")
    }
    if(isValidObjectId(playlistId)){
        throw new ApiError(400,"playlist id not valid")
    }
    const playlist=await Playlist.findByIdAndUpdate(playlistId,
        {
            $pull:{videos:videoId}
        },{new:true}
    )
    if (!playlist) {
        throw new ApiError(500, "Failed to remove video from playlist");
      }
    
      return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video removed from playlist successfully"));

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(isValidObjectId(playlistId)){
        throw new ApiError(400,"playlist id not valid")
    }
    const deletedplaylist=await Playlist.findByIdAndDelete(playlistId);
    if (!deletePlaylist) {
        throw new ApiError(500, "Failed to remove playlist");
      }
    
      return res
        .status(200)
        .json(new ApiResponse(200, deletePlaylist, " removed  playlist successfully"));

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(isValidObjectId(playlistId)){
        throw new ApiError(400,"playlist id not valid")
    }
    const playlist=await Playlist.findByIdAndUpdate(playlistId,{
        $set:{
            name,description
        }
    },{new:true})
    if (!playlist) {
        throw new ApiError(500, "Failed to update playlist");
      }
    
      return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Updated playlist successfully"));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}