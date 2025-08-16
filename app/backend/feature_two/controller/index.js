import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { Medication } from '../model/medication.model.js'
import { ApiRes } from "../utils/apiRes.js";
import { client } from "../db/index.redis.js";
import mongoose from "mongoose";
// adding the medication
const addmedication = asyncHandler(async (req , res) => {    
    const {medicineName , dosage , startDate , endDate , timing ,} = req.body ;
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
// get medications
const getUserMed = asyncHandler(async (req , res) => {
    const { _id } = req.decoded ;
    
    try {
        const medName = req.query.medName || null ;
        console.log(medName);        
        if(medName !== null){
            console.log("yes we got the query!");  
            const medications = await Medication.aggregate([
                {
                    $group: {
                        _id: "$medicineName"
                    }
                },
                {
                    $match: {
                        userId : new mongoose.Types.ObjectId(_id)
                    }
                }
            ])
            console.log("Here are the medications",medications);
            return res
            .status(200)
            .json(
                new ApiRes(200 , medications , "got it")
            )
        }
        console.log("Else part is running");
        
        const medications = await Medication.aggregate([
            {
                $match: {
                    userId : new mongoose.Types.ObjectId(_id)
                }
            }
        ])
        if(!medications){
            return res
            .status(404)
            .json(
                new ApiError(404 , null , "No data found!")
            )
        }
        const medArray = [] ;
        for(let elm of medications){         
            const { medicineName , dosage , endDate , startDate , timing } = elm;
            const medicationObj = {
                medicineName : medicineName,
                dosage : dosage,
                startDate : startDate,
                endDate : endDate,
                timing : timing
            }
            medArray.push(medicationObj)
        }  
        
        await client.set(`user_Medication:${_id}`, medArray)
        await client.expire(`user_Medication:${_id}`, Number(process.env.REDIS_EXPIRY))
        return res
        .status(200)
        .json(
            new ApiRes(200 , medications , "Successfully recevied data!")
        )
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json(
            new ApiError(500 , null , "something went wrong!")
        )
    }
})

export {
    addmedication ,
    getUserMed
}