const mongoose = require("mongoose");

var cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],

    cartTotal: Number,
    totalAfterDiscount: Number,
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { 
    timestamps: true,
    
  }
);



//Export the model
module.exports = mongoose.model("cart", cartSchema);
