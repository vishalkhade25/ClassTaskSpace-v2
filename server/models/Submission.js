import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    assignment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Assignment",
        required : true
    },
    student : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    pdfUrl : {
        type : String,
        required : true
    },
    submittedAt : {
        type : Date,
        default : Date.now
    },
    isLate : {
        type : Boolean,
        default : false
    },
    marks : {
        type : Number
    },
    gradedAt : {
        type : Date
    }
},{
    timestamps : true
});

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

const submissionModel = mongoose.model("Submission", submissionSchema);

export default submissionModel;