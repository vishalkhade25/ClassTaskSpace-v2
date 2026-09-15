import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    password : {
        type : String,
        required : function (){
            return this.authProvider === 'local';
        }
    },
    role : {
        type : String,
        enum : ['teacher', 'student'],
        required : true
    },
    authProvider : {
        type : String,
        enum : ["google","local"],
        default : "local"
    },
    googleId : {
        type : String,
        sparse : true
    },
    isEmailVerified : {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
});

const userModel = mongoose.model('User', userSchema);

export default userModel;