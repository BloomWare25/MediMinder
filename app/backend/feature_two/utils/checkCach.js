import { client } from "../db/index.redis.js";
import { ApiRes } from "./apiRes.js";
import { ApiError } from './apiError.js'
import { asyncHandler } from "./asynchandler.js";

const checkCachedData = asyncHandler(async (req, res, next) => {
    const { _id } = req.decoded;
    try {
        const cachedData = await client.get(`user_Medication:${_id}`);
        console.log(cachedData);                          
        if (cachedData === null) {
            return next() ;
        }
        return res
                .status(200)
                .json(
                    new ApiRes(200, cachedData, "data fecthed from cache")
                )
    } catch (error) {
        console.log(error);        
        return res
        .status(500)
        .json(
            new ApiError(500 , null , "Something went wrong while fetching the data!")
        )
    }
})

export {
    checkCachedData
}