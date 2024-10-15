const mongoose = require("mongoose");

const itemSchema= mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number
    }
})

const orderSchema = mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

   items:[itemSchema],

    shippingAddress: {
        type: String,
        required:true
    },

    status: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema)