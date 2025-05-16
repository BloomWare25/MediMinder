import express from "express"
import { verifyJwtRefresh } from '../Middleware/verifyforRefreshToken.js'
import { updateToken } from "../controller/delete&UpdateAcc.register.js";
const updateTokenRouter = express.Router() ;



// update the access token and refresh token through this route 
updateTokenRouter.route("/upadare_token").patch(
    verifyJwtRefresh ,
    updateToken
)

export {
    updateTokenRouter 
}