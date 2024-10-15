const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const OrderHelper = require("../helper/orderHelper")

const getAllOrders = async (req, res) => {
    try {

        if (req.params.userId !== req.user.id) {
            throw new Error("Forbidden!")
        }
        const user_id = req.params.userId;
        const orders = await Order.find({ user_id: user_id });
        if (orders) {
            res.status(200).json(orders);
        } else {
            throw new Error("Couldn't fetch order!")
        }
    } catch (error) {
        res.status(500).json({
            title: "Internal Server Error",
            message: error.message,
            stackTrace: error.stack
        });
    }
};


const createOrder = async (req, res) => {

    try {
        const { items, shippingAddress } = req.body;
        if (!items || !shippingAddress) {
            res.status(400);
            throw new Error("All fields are mandatory!");
        }
        const totalPrice = OrderHelper.getTotalPrice(items);

        const newOrder = await Order.create({
            items,
            shippingAddress,
            status: "Pending",
            totalPrice: totalPrice,
            paymentStatus: "Pending",
            user_id: req.user.id
        });
        if (newOrder) {
            res.status(201).json({
                orderId: newOrder.id,
                status: newOrder.status,
                totalPrice: newOrder.totalPrice,
                paymentStatus: newOrder.paymentStatus
            });
        } else {
            throw new Error("Couldn't place order");
        }
    } catch (error) {
        res.status(500).json({
            title: "Internal Server Error",
            message: error.message,
            stackTrace: error.stack
        });

    }

};



const getOrderDetails = async (req, res) => {
    try {
        const orderDetails = await Order.findById(req.params.orderId);
        if (orderDetails.user_id.toString() !== req.user.id) {
            throw new Error("Forbidden!")
        }
        if (orderDetails) {
            res.status(200).json(orderDetails)
        } else {
            throw new Error("Couldn't fetch order details!")
        }
    } catch (error) {
        res.status(500).json({
            title: "Internal Server Error",
            message: error.message,
            stackTrace: error.stack
        });
    }
};


const updateOrderStatus = async (req, res) => {
    try {

        const orderDetails = await Order.findById(req.params.orderId);
        if (orderDetails.user_id.toString() !== req.user.id) {
            throw new Error("Forbidden!")
        }

        const updateStatus = await Order.findByIdAndUpdate(
            req.params.orderIdu,
            req.body,
            {
                new: true
            }
        );
        if (updateStatus) {
            res.status(200).json(
                {
                    orderId: updateStatus.id,
                    status: updateStatus.status
                }
            );
        } else {
            throw new Error("Update Failed!");
        }

    } catch (error) {
        res.status(500).json({
            title: "Internal Server Error",
            message: error.message,
            stackTrace: error.stack
        });
    }

};

const deleteOrder = async (req, res) => {

    try {
        const orderDetails = await Order.findById(req.params.orderId)
        if (orderDetails.user_id.toString !== req.user.id) {
            throw new Error("Forbidden!");
        }
        await Order.findByIdAndDelete(req.params.orderId)
        res.status(200).json({ title: "Success", message: "Order has been Cancelled!" })
    } catch (error) {
        res.status(500).json({
            title: "Internal Server Error",
            message: error.message,
            stackTrace: error.stack
        });
    }
};

module.exports = { getAllOrders, createOrder, getOrderDetails, updateOrderStatus, deleteOrder }