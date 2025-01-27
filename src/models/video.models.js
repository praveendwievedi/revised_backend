import mongoose,{ Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema=Schema({
    videoFile:{
        type:String,
        required:true,
    },
    // this is an image file
    thumbnail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number, // will be given by the cloudinary as it provide all the details about the files
        required:true
    },
    views:{
        type:Number,
        // required:true
        default:0
    },
    isPublished:{
        type:Boolean,
        deafault:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timeStamps:true})

videoSchema.plugin(mongooseAggregatePaginate);

export const Video=mongoose.model("Video",videoSchema)