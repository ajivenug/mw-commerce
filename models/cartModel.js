const mongoose = require("mongoose");

const itemSchema= mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number
    },
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
})

const cartSchema = mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

   items:[itemSchema],

},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Cart", cartSchema)