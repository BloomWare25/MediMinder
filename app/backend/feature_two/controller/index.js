import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { Medication } from '../model/medication.model.js'
import { ApiRes } from "../utils/apiRes.js";

// adding the medication
const addmeedication = asyncHandler(async (req , res) => {    
    const {medicineName , dosage , startDate , endDate , timing ,} = req.body ;
    console.log("Recived Decoded data: ", req.decoded);
    const { _id } = req.decoded ;
    const startdate = new Date(startDate); // dates must be in ISO format : yyyy-mm-dd
    const enddate = new Date(endDate);
    try {
        [medicineName , dosage , startDate , endDate , timing].some((val) => {
            if(val === undefined || val === null || val === ""){
                return res
                .status(400)
                .json(
                    new ApiError(400 , "Bad Request!" , "All fields are required")
                )
            }
        })
        if(startDate  > endDate){
            return res
            .status(400)
            .json(
                new ApiError(400 , "Bad Request!" , "Start date cannot be after end date")
            )
        }
        const medication = await Medication.create({
            userId: _id,
            medicineName : medicineName,
            dosage: dosage,
            startDate: startdate,
            endDate: enddate,
            timing: timing,
        })
        if(!medication){
            return res
            .status(500)
            .json(
                new ApiError(500 , 'something went wrong while creating the medication object' , null)
            )
        }
        return res
        .status(200)
        .json(
            new ApiRes(200 , medication , "Medication objected created successfully!")
        )
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json(
            new ApiError(500 , "Something went wrong" , error.message)
        )        
    }
})


export {
    addmeedication
}