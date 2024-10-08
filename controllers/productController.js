
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");


const getProducts = asyncHandler(async (req, res) => {

    const products = await Product.find();
    if (products) {
        const filteredProducts = products.map((product) => ({
            productId: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            inventory: product.inventory
        }));
        res.status(200).json(filteredProducts);
    }

});


const addNewProduct = asyncHandler(async (req, res) => {

    if (req.user.username !== "admin") {
        res.status(403);
        throw new Error("Only admin can add product!");
    }
    const { name, description, price, category, inventory } = req.body;
    if (!name || !price || !category || !inventory) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const checkProductNameAvailable = await Product.findOne({ name });
    if (checkProductNameAvailable) {
        res.status(400);
        throw new Error("Product Name already exists..Please give a new name!");
    }
    const newProduct = await Product.create({
        name,
        description,
        price,
        category,
        inventory,
        user_id: req.user.id
    });
    if (newProduct) {
        res.status(201).json({
            productId: newProduct.id,
            name: newProduct.name,
            price: newProduct.price
        });
    } else {
        res.status(400);
        throw new Error("Couldn't add product");
    }

});


const getProductDetails = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId);
    if (product) {
        res.status(200).json(product);
    }
});


const updateProduct = asyncHandler(async (req, res) => {

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.productId,
        req.body,
        {
            new: true
        }
    );
    if (updatedProduct) {
        res.status(200).json(
            {
                productId: updatedProduct.id,
                name: updatedProduct.name,
                price: updatedProduct.price
            }
        );
    } else {
        res.status(500);
        throw new Error("Update Failed!");
    }

});

const deleteProduct = asyncHandler(async (req, res) => {

    if (req.user.username !== "admin") {
        res.status(403);
        throw new Error("Only admin can add product!");
    }
    await Product.findByIdAndDelete(
        req.params.productId

    )
    res.status(200).json({ title: "Success", message: "Product deleted successfully!!" })
});

const filterProducts = asyncHandler(async (req, res) => {
    console.log("line 107")
    const { category, sortBy, sortOrder = "asc", limit = 10, page = 1 } = req.query;
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
        throw new Error("Invalid limit param");
    }
    if (isNaN(parsedPage) || parsedPage <= 0) {
        throw new Error("Invalid page param");
    }
    const sortDirection = sortOrder === "desc" ? -1 : 1
    const sortOptions = {};
    if (sortBy) {
        sortOptions[sortBy] = sortDirection;
    }
    console.log("line 121")
    const products = await Product.find({ category: category }).sort(sortOptions).limit(parsedLimit).skip((parsedPage - 1) * parsedLimit);
    const filteredProducts = products.map((product) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        inventory: product.inventory
    }))
    res.status(200).json(filteredProducts);
});








module.exports = { getProducts, addNewProduct, getProductDetails, updateProduct, deleteProduct, filterProducts }