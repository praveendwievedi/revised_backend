import mongoose,{Schema} from "mongoose";

const playlistSchema = new Schema({
    name:{
        type:String,
        required:[true,"set the playlist name"]
    },
    description:{
        type: String,
    },
    videos:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export const PlayList=mongoose.model("PlayList",playlistSchema)