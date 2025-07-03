import { TemporarySignup } from '../models/userTemData.models.js'
import { ApiError } from './apiError.js';
import { asyncHandler } from './asyncHandler.js'

// standards for error handling with the otp validation failure 
// 0U for no user 
// 0OTP for wrong otp 
// 0EOTP for expired otp 

const verifyOtp = async (email , otp) => {
    const user = await TemporarySignup.findOne({email});
    if(!user){
        return 'OU' ;
    }
    
    if(user.otp != otp){
        return '0OTP' ;
    }
    
    if(user?.otpExpiry < Date.now()){
        await TemporarySignup.deleteOne({ email });
        return '0EOTP' ;
    }
    await TemporarySignup.findOneAndDelete({email});
    return user.userData ;
}

export {verifyOtp}