import mongoose,{Schema,Model} from "mongoose";

const subscriptionSchema=new Schema({
    subscriber:
        {
            type: Schema.Types.ObjectId,// one for those whom subscribe the user
            ref:"User"
        }
    ,
    channel:{
        type:Schema.Types.ObjectId,// one for those the user will subscribe 
        ref:"User"
    }
})

export const Subscription=Model("Subscription",subscriptionSchema)