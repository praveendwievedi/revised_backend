import mongoose,{Schema,Model} from "mongoose";

// i use object for subscriber instead of array  because i want to create a document everytime anyone subscribe anyone 
// that document will be more usefull than array. 
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