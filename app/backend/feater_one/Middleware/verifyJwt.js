import jwt from "jsonwebtoken" ;
// import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const veifyJWT = async (req , res , next) => {
    try {
        const accessToken = req.headers["Authorization"]?.split(" ")[1] || req.headers["authorization"]?.split(" ") ;
        if(!accessToken) {
            return res
            .status(401)
            .json(
                new ApiError(401 , {
                    success: false,
                    message: "No token provided",
                }))
        }
        const payload = await jwt.verify(accessToken[0] , process.env.ACCESS_TOKEN_SECRET) ;
        if(!payload){
            return res
            .status(401)
            .json(
                new ApiError(401 , {
                    success: false,
                    message: "Invalid token or expired",
                }))
        }
    
        req.user = payload ;
        next() ;
    } catch (error) {
        return res
        .status(402)
        .json(
            new ApiError(402 , {
                success: false,
                message: "Invalid token or expired",
            }))
    }
}

export { veifyJWT } ; 