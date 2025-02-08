const mongoose=require('mongoose');


const userSchema=mongoose.Schema({
    fullname : String,
    email: String,
    password:String,
    cart:[{
        quantity:{
            type:Number,
            default:0,
        },
        productid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',},
        
    }],
    
    orders:{
        type:Array,
        default:[],
    },
    contact:Number,
    picture:String,
})

module.exports=mongoose.model('users',userSchema);