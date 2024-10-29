const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    orderId: {
        type: String,
        required: [true, "Please add orderId"]
    },
    amount: {
        type: Number
    },
    paymentMethod: {
        type: String,
        required: [true, "Please add payment method"]
    },
    paymentDetails: {
        type: Number,
        required: [true, "Please add payment details"]
    },
    paymentStatus: {
        type: String
    },
    refundStatus: {
        type: String
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Payment", paymentSchema)