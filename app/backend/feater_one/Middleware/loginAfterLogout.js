// i am making this midleware to check if the user is logged out if he loged out then i will delte the user from EpiredToken and the log in the user
import { ApiError } from "../utils/apiError.js";
import { ExpiredToken } from "../models/expireToken.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { isTokenBlocked }from "../Middleware/checkForValidToken.js"

const loginAfterLogout = async (req , res , next) => {
    try {
        const email = req.body.email ;
        const user = await  isTokenBlocked(email) ;
        if(user){
            await ExpiredToken.findOneAndDelete({email})
        }
        next() ;
    } catch (error) {
        throw new ApiError(500 , error , "Something went wrong") ;
    }
}

export { loginAfterLogout }