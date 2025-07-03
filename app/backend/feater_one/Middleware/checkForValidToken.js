import { ExpiredToken } from "../models/expireToken.model.js"
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";

const isTokenBlocked = async (email) => {
    const user = await ExpiredToken.findOne({email}) ;
    if(user){
        return true ; 
    }else{
        return false ;
    }
}
// the token from logout user will be added to the expired token list
// and the token will be blacklisted
const makeTheValidToken = async (req , res , next) => {
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
        const payload = req.user ; 
        const { _id } = payload ; 
        const user = await User.findOne({_id})

        const refreshtoken = user.refreshToken ;
        
        const ifBlockedToken = await isTokenBlocked(user.email) ; 
            if(ifBlockedToken){
                return res
            .status(404)
            .json(
                new ApiError(404 , null , "AccessToken has been revoked you must login or create acc first")
            )
        }
        const tokenExpiry =  new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day
        const whitelistedToken = await ExpiredToken.create(
            {
                refreshToken: refreshtoken ,
                accessToken: accessToken ,
                tokenExpiry: tokenExpiry ,
                email: user.email 
            }
        )
        
        if(!whitelistedToken){
           throw new ApiError(501 , null , "The token can't be whitelisted")
        }
        next()
    } catch (error) {
        return res
        .status(501)
        .json(
            new ApiError(501 , error , "Something went wrong") ,
        )
    }
}

export {
   makeTheValidToken ,
   isTokenBlocked
}
