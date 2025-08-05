import { ApiError } from "../utils/apiError.js"
import jwt from 'jsonwebtoken'

const authUser = (req , res , next) => {
    const token = req.headers.authorization?.split(" ")[1] ;
    console.log(req.headers);
    
    if(!token){
        return res
        .status(401)
        .json(
            new ApiError(401 , "Unauthorized!" , "Token not provided")
        )
    }
    try{
        const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);
        if(!decoded){
            return res
            .status(401)
            .json(
                new ApiError(401 , "Unauthorized!" , "Invalid token")
            )
        }
        next();
    }catch(err){
        console.log(err);        
        return res
        .status(404)
        .json(
            new ApiError(404 , "Not Found!" , err.message)
        )
    }
}

export {
    authUser
}