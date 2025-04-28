import express from "express"
import { upload } from "../Middleware/upload.middleware.js"
import { regUser , ifOtpVerified } from "../controller/register.js";
 
const router = express.Router();

router.route("/register").post(
    upload.single("avatar"),
    regUser 
)

router.route("/verifyotp")
.post(
    ifOtpVerified 
)

export { router } 