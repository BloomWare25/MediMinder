import { asyncHandler } from "../utils/asynchandler.js";

const addmeedication = asyncHandler(async (req , res) => {
    const {medicineName , dosage , startDate , endDate , timing} = req.body ;
    console.log("Recived Data : ", res.body);
    return  
})
export {
    addmeedication
}