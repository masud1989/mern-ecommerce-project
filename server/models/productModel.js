const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase: true
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        select: false,
    },
    category:{
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "category",
        required: true
    },
    brand: {
        type: String,
        // enum: ["Apple", "Samsung", "Lenovo"] 
    },
    quantity: {
        type: Number,
        required:true,
        select: false,
    },
    soled: {
        type: Number,
        default: 0,
    },
    images: {
        type: Array,
    },
    color:{
        type: String,
        // enum: ["Black", "Blue", "Red", "Green"]
        required: true
    },
    ratings: [
        {
            star: Number, 
            postedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}
        }
    ]
}, {timestamps:true});

//Export the model
module.exports = mongoose.model('product', productSchema);