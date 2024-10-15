const express= require("express")
const orderController= require("../controllers/orderController")
const validateToken=require("../middleware/validateTokenHandler")


const router= express.Router();

router.use(validateToken);


router.post("/",orderController.createOrder);
router.get("/",orderController.getAllOrders);
router.get("/:orderId",orderController.getOrderDetails);
router.put("/:orderId",orderController.updateOrderStatus);
router.delete("/:orderId",orderController.deleteOrder);






module.exports=router;