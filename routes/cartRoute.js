const express= require("express")
const cartController= require("../controllers/cartController")
const validateToken=require("../middleware/validateTokenHandler")


const router= express.Router();

router.use(validateToken);


router.post("/:userId/items",cartController.addItemToCart);
router.delete("/:userId/items/:productId",cartController.removeFromCart);
router.get("/:userId",cartController.getCartItems);



module.exports=router;