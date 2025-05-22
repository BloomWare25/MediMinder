import express from "express"
import { upload } from "../Middleware/upload.middleware.js"
import { regUser , ifOtpVerified , loginUser , userDetails , logoutUser} from "../controller/register.js";
import { delacc } from "../controller/delete&UpdateAcc.register.js"
import multer from "multer";
import { veifyJWT } from "../Middleware/verifyJwt.js"
import { updatePass , updateUserCred } from "../controller/delete&UpdateAcc.register.js"
import { makeTheValidToken } from "../Middleware/checkForValidToken.js"
import {cacheUser} from "../Middleware/returnsTheUserFromRedis.js"


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
    cacheUser ,
    userDetails
)

// userlogout through this route
router.route("/logout").post(
    veifyJWT ,
    makeTheValidToken , 
    logoutUser
)

// update the user password 
router.route("/update_pass").patch(
    uploadUser.none() ,
    veifyJWT ,
    updatePass 
)

// delete the user account through this route
router.route("/deleteacc").delete(
    veifyJWT ,
    delacc
)

// update the user credentials through this route
router.route("/update_user").patch(
    upload.single("avatar"),
    veifyJWT ,
    updateUserCred
)
export { router } 