import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    subject : {
        type : String,
        required : true
    },
    classCode : {
        type : String,
        required : true,
        unique : true
    },
    teacher : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    students : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ]
},{
    timestamps : true
});

const classModel = mongoose.model('Class',classSchema);

export default classModel;