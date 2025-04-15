import mongoose from "mongoose"

new userSchema = mongoose.Schema({

} , {
    timestamps : true
});

export const User = mongoose.model("User" , userSchema) ;