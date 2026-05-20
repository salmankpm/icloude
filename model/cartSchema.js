import mongoose from 'mongoose'

export const prodectSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
       uppercase: true
    },
    price:{
         type:String,
        required:true 
    },
    category:{
         type:String,
        required:true,
        uppercase: true 
    },
    image:{
        type:String
    },
    userId:{
         type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false,
        require:true
    }
})

export const cartModel =mongoose.model('cart',prodectSchema)