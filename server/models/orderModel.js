const mongoose = require('mongoose'); 

var orderSchema = new mongoose.Schema({
  products: [
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
        },
        count: Number,
        color: String
    } 
  ],

  paymentIntent: {},
  orderStatus: {
    type: String,
    default: "Not Process",
    enum: ["Not Processed", "Cash on Delivery", "Processing", "Dispatched", "Cancelled", "Delivered"]
  },
  orderBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  }

}, {timestamps: true});

//Export the model
module.exports = mongoose.model('order', orderSchema);