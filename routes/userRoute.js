const express= require("express")
const userController= require("../controllers/userController")
const validateToken=require("../middleware/validateTokenHandler")


const router= express.Router();

router.post("/register",userController.registerUser);
router.post("/login",userController.loginUser);
router.get("/:userId",validateToken,userController.getUserProfile);
router.put("/:userId",validateToken,userController.updateUser);
router.delete("/:userId",validateToken,userController.deleteUser);
router.delete("/:userId",validateToken,userController.deleteUser);
router.put("/:userId/password",validateToken,userController.changePassword);
router.post("/verifyToken",validateToken,userController.verifyToken);
router.post("/checkUserRole",validateToken,userController.checkUserRole);





module.exports=router;