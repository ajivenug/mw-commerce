const mongoose = require("mongoose");

const productSchema = mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    name: {
        type: String,
        required: [true, "Please add product name"]
    },

    description: {
        type: String
    },

    price: {
        type: Number,
        required: [true, "Please add product price"]
    },
    category: {
        type: String,
        required: [true, "Please add product category"]
    },
    inventory: {
        type: Number,
        required: [true, "Please add product inventory"]
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema)