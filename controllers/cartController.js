const asyncHandler = require("express-async-handler");


const Cart = require("../models/cartModel");
const Product=require("../models/productModel");


const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  console.log(req.body);
  if (!productId) {
    res.status(400);
    throw new Error("ProductId is missing!");
  }
  if (req.params.userId !== req.user.id) {
    res.status(403);
    throw new Error("Forbidden!");
  }
  const user_id = req.params.userId;
  console.log("line 18");
  const product = await Product.findById(productId);
  console.log("line 19",product);
  const availableCart = await Cart.findOne({ user_id });
  if (availableCart) {
    let items = availableCart.items;
    const foundProduct = items.find((item) => item.productId === productId);
    if (foundProduct) {
      foundProduct.quantity += quantity;
      items = items.map((item) =>
        item.productId === productId ? foundProduct : item
      );
    } else {
      items.push({ productId: productId, quantity: quantity ,name:product.name,price:product.price});
    }
    const payload = { user_id: user_id, items: items };
    const updatedCart = await Cart.findByIdAndUpdate(
      availableCart.id,
      payload,
      {
        new: true,
      }
    );
    if (updatedCart) {
      res
        .status(200)
        .json({ cartId: updatedCart.id, items: updatedCart.items });
    }
  } else {
    let newItem = [{ productId: productId, quantity: quantity ,name:product.name,price:product.price}];
    const newCart = await Cart.create({
      user_id: user_id,
      items: newItem,
    });


    if (newCart) {
      res.status(200).json({ cartId: newCart.id, items: newCart.items });
    }
  }
});


const removeFromCart = asyncHandler(async (req, res) => {
  if (req.params.userId !== req.user.id) {
    res.status(403);
    throw new Error("Forbidden!");
  }
  const user_id = req.params.userId;
  const availableCart = await Cart.findOne({ user_id });
  if (availableCart) {
    let items = availableCart.items;
    const foundProduct = items.find(
      (item) => item.productId === req.params.productId
    );
    if (foundProduct) {
      items = items.filter((item) => item.productId !== req.params.productId);
      const payload = { user_id: user_id, items: items };
      const updatedCart = await Cart.findByIdAndUpdate(
        availableCart.id,
        payload,
        {
          new: true,
        }
      );
      if (updatedCart) {
        res.status(200).json({ message: "Item removed from cart" });
      }
    } else {
      res.status(400);
      throw new Error("Product Not Found");
    }
  } else {
    res.status(400);
    throw new Error("Cart Not Found");
  }
});


const getCartItems =asyncHandler(async (req,res)=>{
  if (req.params.userId !== req.user.id) {
    res.status(403);
    throw new Error("Forbidden!");
  }
  const user_id = req.params.userId;
  const availableCart = await Cart.findOne({ user_id });
  if (availableCart) {


    res.status(200).json({cartId:availableCart.id,items:availableCart.items})
  }else{
    res.status(500).json({message:"Cart Not found!!"})
    
  }


})



module.exports = { addItemToCart, removeFromCart,getCartItems };