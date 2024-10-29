
const asyncHandler = require("express-async-handler");
const Payment = require("../models/paymentModel");


const initiatePayment = asyncHandler(async (req, res) => {

    const { orderId, amount, paymentMethod, paymentDetails } = req.body;
    if (!orderId || !amount || !paymentMethod || !paymentDetails) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const newPayment = await Payment.create({
        orderId,
        amount,
        paymentMethod,
        paymentDetails,
        user_id: req.user.id,
        paymentStatus: "Processing",
        refundStatus: "NA"
    });
    if (newPayment) {
        res.status(200).json({
            paymentId: newPayment.id, status: newPayment.paymentStatus
        });
    } else {
        res.status(500);
        throw new Error("Payment Failed!");
    }
});


const updatePaymentStatus = asyncHandler(async (req, res) => {

    const { paymentStatus } = req.body;
    if (!paymentStatus) {
        res.status(400);
        throw new Error("Bad Request!");
    }
    const payment = await Payment.findById(req.params.paymentId);
    if (payment) {
        if (payment.user_id.toString() !== req.user.id) {
            res.status(403);
            throw new Error("Forbidden!");
        }
        const updatePaymentStatus = await Payment.findByIdAndUpdate(
            req.params.paymentId, req.body, { new: true }
        );
        if (updatePaymentStatus) {
            res.status(200).json({
                paymentId: updatePaymentStatus.id,
                status: updatePaymentStatus.paymentStatus
            });
        } else {
            res.status(400);
            throw new Error("Couldn't update payment status");
        }
    } else {
        res.status(400);
        throw new Error("Invalid paymentId!");
    }

});


const getPaymentStatus = asyncHandler(async (req, res) => {
    const payment = await Product.findById(req.params.paymentId);
    if (payment) {
        if (payment.user_id.toString() !== req.user.id) {
            res.status(403);
            throw new Error("Forbidden!");
        }
        res.status(200).json({
            paymentId: payment.id,
            orderId: payment.orderId,
            amount:payment.amount,
            status:payment.paymentStatus
        });

    }else{
        res.status(500);
        throw new Error("PaymentId not valid!");
    }
});


const refundPayment = asyncHandler(async (req, res) => {

    const{amount}=req.body;
    const payment = await Payment.findById(req.params.productI);
    if (payment) {
        if (payment.user_id.toString() !== req.user.id) {
            res.status(403);
            throw new Error("Forbidden!");
        }
        const payload={refundStatus:"Initiated"}
        const updateRefundStatus = await Payment.findByIdAndUpdate(
            req.params.paymentId, req.body, { new: true }
        );
        if (updateRefundStatus) {
            res.status(200).json({
                paymentId: updateRefundStatus.id,
                status: updateRefundStatus.refundStatus
            });
        } else {
            res.status(400);
            throw new Error("Couldn't update payment status");
        }

    }else{
        res.status(500);
        throw new Error("PaymentId not valid!");
    }

});

module.exports = { initiatePayment, updatePaymentStatus, getPaymentStatus, refundPayment }