import { client } from "../db/redis.db.js";
import { ApiResponse } from "../utils/apiResponse.js";

const cacheUser = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) return next();

    const cachedUser = await client.hgetall(`user:${userId}`);
    
    if(cachedUser !== null) {
        return res.status(200).json(
        new ApiResponse(200, cachedUser, "User details (from cache)")
      );
    }
      next();
      // No cache → continue to controller
  } catch (err) {
    console.error("Redis error:", err);
    next(); // On error, proceed normally
  }
};

export { cacheUser } 
