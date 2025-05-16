
import { User } from "../models/user.models.js";

const findUser = async (_id) => {
    const user = await User.findById(_id) ;
    return user ;
}

export {
    findUser 
}