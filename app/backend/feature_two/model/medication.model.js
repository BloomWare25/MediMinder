// medicine name 
// dosage : dawn , morning etc 
// start date 
// end date 
// timing food [before || after]
import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    medicineName : {
        type: String,
        required: true,
        trim: true,
    },
    dosage: {
        type: [{
            type: String,
            enum: ["dawn" , "morning" , "afternoon" , "evening" , "night"],
            required: true,
            lowercase: true,
        }],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    timing: {
        type: String,
        enum: ["before", "after"],
        required: true,
    }

})

const Medication = mongoose.model("Medication" , medicationSchema) ;

export {
    Medication
}