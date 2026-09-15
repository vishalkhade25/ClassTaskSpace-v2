import mongoose from "mongoose";

const EmailVerificationSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    otpHash : {
        type : String,
        required : true
    },
    expiresAt : {
        type : Date,
        required : true
    },
    attempts : {
        type : Number,
        required : true,
        default : 0
    }
},{
    timestamps : true
});

const EmailVerificationModel = mongoose.model("EmailVerification", EmailVerificationSchema);

export default EmailVerificationModel;