import express from "express"
import { upload } from "../Middleware/upload.middleware.js"
import { regUser } from "../controller/register.js";
 
const router = express.Router();

router.route("/register").post(
    upload.single("avatar"),
    regUser 
)

export { router } 