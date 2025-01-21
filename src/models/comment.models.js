import mongoose,{Schema} from "mongoose";

const commentSchema=new Schema({
    content:{
        type:String,
        required:[true,"cannot do empty comments"]
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export const Comment=mongoose.model('Comment',commentSchema) 