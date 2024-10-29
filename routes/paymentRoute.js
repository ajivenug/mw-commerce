const express= require("express")
const paymentController= require("../controllers/paymentController")
const validateToken=require("../middleware/validateTokenHandler")


const router= express.Router();

router.use(validateToken);


router.post("/",paymentController.initiatePayment);
router.get("/:paymentId",paymentController.getPaymentStatus);
router.put("/:paymentId",paymentController.updatePaymentStatus);
router.post("/:paymentId/refund",paymentController.refundPayment);


module.exports=router;