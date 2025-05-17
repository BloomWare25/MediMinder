import jwt from "jsonwebtoken" ;
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";

// middleware for checking if the refresh token is correct
const verifyJwtRefresh = async (req , res , next) => {
     const refreshToken = req.headers["authorization"]?.split("Bearrer ")[1] || req.headers["authorization"]?.split(" ")[0] ;
    try {
        if(!refreshToken){
            return res
            .status(401)
            .json(
               new ApiError(401 , null , "Unauthorised Can't get the refreshtoken")
            )
        }
        const payload = await jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET)
        if(!payload){
            return res
            .status(401)
            .json(
               new ApiError(401 , null , "wrong token or token has been expired")
            )
        }
        const user = await User.findById(payload) ;// as refresh token only returns the user _id nothing else
        if(!user){
            return res
            .status(404)
            .json(
               new ApiError(404 , null , "Can't get the user!")
            )
        }
        req.user = user ;
        next() ;
    } catch (error) {
        console.log(error);
        return res.status(500)
        .json(
           new ApiError(500 , error , "Something went wrong!")
        )
    }
}

export {
    verifyJwtRefresh 
}