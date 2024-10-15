const Product = require("../models/productModel")

const getTotalPrice = async (items) => {
    try {
        let totalPrice = 0;
        for (const item of items) {
            if (!item.productId || !item.quantity) {
                throw new Error("Some product details are missing!")
            }

            const productOrdered = await Product.findById(item.productId);
            if (!productOrdered) {
                throw new Error(`Product with Id ${item.productId} not found`);
            }

            const price = productOrdered.price * item.quantity;
            totalPrice += price;
        }
        return totalPrice;

    } catch (error) {

        console.error("Error Calculating on total Price", error);
        throw error;
    }
}

module.exports = { getTotalPrice }