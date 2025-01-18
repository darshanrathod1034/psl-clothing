const mongoose=require('mongoose');


const productSchema=mongoose.Schema({
    image:String,
    name : String,
    prise: Number,
    discount:{
        
        type:Number,
        default:0,
    },
    picture:String,
})

module.exports=mongoose.model('product',productSchema);