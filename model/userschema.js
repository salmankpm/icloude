import mongoose from 'mongoose'

export const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
         type:String,
        required:true 
    },
     isBlocked: {
        type: Boolean,
        default: false
    }
})

export const registerModel=mongoose.model('userregister',userSchema)