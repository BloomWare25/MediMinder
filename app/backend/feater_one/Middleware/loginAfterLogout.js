// i am making this midleware to check if the user is logged out if he loged out then i will delte the user from EpiredToken and the log in the user
import { ApiError } from "../utils/apiError.js";
import { ExpiredToken } from "../models/expireToken.model.js";
import { isTokenBlocked }from "../Middleware/checkForValidToken.js"

const loginAfterLogout = async (req , res , next) => {
    const accesstoken = req.headers["authorization"]?.split("Bearrer ")[1] || req.headers["authorization"]?.split(" ")[0] ;
    try {
        const email = req.body.email ;
        const user = await  isTokenBlocked(email , accesstoken) ;

        if(user){
            await ExpiredToken.findOneAndDelete({email})
        }
        next() ;
    } catch (error) {
        throw new ApiError(500 , error , "Something went wrong") ;
    }
}

export { loginAfterLogout }