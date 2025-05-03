import { log } from 'console';
import { TemporarySignup } from '../models/userTemData.models.js'
import { ApiError } from './apiError.js';
import { asyncHandler } from './asyncHandler.js'


const verifyOtp = async (email , otp) => {
    const user = await TemporarySignup.findOne({email});
    if(!user){
        throw new ApiError(400 , 'No OTP found. Please register first.');
    }
    
    if(user.otp != otp){
        throw new ApiError(400 , "invalid otp")
    }
    
    if(user?.otpExpiry < Date.now()){
        await TemporarySignup.deleteOne({ email });
        throw new ApiError(404 , "Otp is expired. Please re register.")
    }
  
    return user.userData ;
}

export {verifyOtp}