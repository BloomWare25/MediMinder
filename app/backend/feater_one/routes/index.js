import express from "express"
import { upload } from "../Middleware/upload.middleware.js"
import { regUser , ifOtpVerified } from "../controller/register.js";
import multer from "multer";
 
const router = express.Router();

const uploadUser = multer() ;
// register the user through this route 
router.route("/register").post(
    upload.single("avatar"),
    regUser 
)

// verify the otp through this route
router.route("/verifyotp")
.post(
    uploadUser.none(),
    ifOtpVerified 
)


export { router } 