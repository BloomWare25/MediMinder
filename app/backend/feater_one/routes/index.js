import express from "express"
import { upload } from "../Middleware/upload.middleware.js"
import { regUser , ifOtpVerified } from "../controller/register.js";
import multer from "multer";
 
const router = express.Router();

const uploadUser = multer() ;
router.route("/register").post(
    upload.single("avatar"),
    regUser 
)

router.route("/verifyotp")
.post(
    ifOtpVerified 
)

export { router } 