const express= require("express")
const productController= require("../controllers/productController")
const validateToken=require("../middleware/validateTokenHandler")


const router= express.Router();

router.use(validateToken);


router.get("/",productController.getProducts);
router.post("/",productController.addNewProduct);
router.get("/:productId",productController.getProductDetails);
router.post("/filterProducts",productController.filterProducts);
router.put("/:productId",productController.updateProduct);
router.delete("/:productId",productController.deleteProduct);






module.exports=router;