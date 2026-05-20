
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
    isDeleted:{
        type:Boolean,
        default:false,
        require:true
    }
})

export const prodectModel =mongoose.model('Prodect',prodectSchema)