import { ExpiredToken } from "../models/expireToken.model.js"
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken" ;

const isTokenBlocked = async(email) => {
    const user = await ExpiredToken.findOne({email}) ;
    console.log(user);
    
    if(user){
        return false ; 
    }else{
        return true
    }
}

const makeTheValidToken = async (req , res , next) => {
    try {
        
        const accessToken = req.headers["authorization"]?.split("Bearrer ")[1] || req.headers["authorization"]?.split(" ")[0] ;
        if(!accessToken){
            return res
            .status(404)
            .json(
                new ApiError(404 , null , "No AccessToken provided!")
            )
        }
        

        const payload = await jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET) ;

        const { _id } = payload
        const user = await User.findOne({_id})
        console.log(user);
        
        const refreshtoken = user.refreshToken ;
        console.log(`refreshToken ${refreshtoken}`);
        

        const tokenExpiry = 1000 * 60 * 24  ; // 1 day
        const whitelistedToken = await ExpiredToken.create(
            {
                refreshToken: refreshtoken ,
                accessToken: accessToken ,
                tokenExpiry: tokenExpiry ,
                email: user.email 
            }
        )
        console.log(whitelistedToken);
        
        if(!whitelistedToken){
           throw new ApiError(501 , null , "The token can't be whitelisted")
        }

        next()
    } catch (error) {
        throw new ApiError(504 , error , "Something went wrong") ;
        return res
        .status(504)
        .json(
            new ApiError(504 , error , "Something went wrong") ,
        )
    }
}

export {
   makeTheValidToken ,
   isTokenBlocked
}