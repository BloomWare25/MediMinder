import jwt from "jsonwebtoken" ;
import { ApiError } from "../utils/apiError.js";
import { isTokenBlocked } from "./checkForValidToken.js"

const veifyJWT = async (req , res , next) => {
    try {
        const accessToken = req.headers["authorization"]?.split("Bearrer ")[1] || req.headers["authorization"]?.split(" ")[0] ;
        if(!accessToken || accessToken === null || accessToken === undefined){
            return res
            .status(401)
            .json(
                new ApiError(401 , {
                    success: false,
                    message: "No token provided",
                } , "Token not found"))
        }
        
        const payload = await jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET) ;
        if(!payload){
            return res
            .status(401)
            .json(
                new ApiError(401 , {
                    success: false,
                    message: "Invalid token or expired",
                }))
        }
        const ifBlockedToken = await isTokenBlocked(payload.email) ; 
         if(ifBlockedToken){
            return res
            .status(404)
            .json(
                new ApiError(404 , null , "AccessToken has been revoked you must login first")
            )
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