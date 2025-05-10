import express from "express"
import { upload } from "../Middleware/upload.middleware.js"
import { regUser , ifOtpVerified , loginUser , userDetails , logoutUser} from "../controller/register.js";
import { delacc } from "../controller/deleteAcc.register.js"
import multer from "multer";
import { veifyJWT } from "../Middleware/verifyJwt.js"

 
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

// login the user through this route
router.route("/login").post(
    uploadUser.none(),
    loginUser
)

// user details through this route
router.route("/getuserdata").get(
    veifyJWT ,
    userDetails
)

// userlogout through this route
router.route("/logout").post(
    veifyJWT ,
    logoutUser
)

// delete the user account through this route
router.route("/deleteacc").delete(
    veifyJWT ,
    delacc
)
export { router } 