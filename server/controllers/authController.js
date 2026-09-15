import userModel from "../models/User.js";
import EmailVerificationModel from "../models/EmailVerification.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../config/mailer.js";
import dotenv from "dotenv"
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) =>{
    try {
        const { name, email, password, role } = req.body;
        if(!name || !email || !password || !role){
            return res.status(400).json({ success: false, message: "Please enter all details" });
        }
        const existingEmail = await userModel.findOne({email});
        if(existingEmail && existingEmail.isEmailVerified){
            return res.status(400).json({ success: false, message: "User with this email already exists!" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let user;
        if(existingEmail){
            existingEmail.name = name;
            existingEmail.password = hashedPassword;
            existingEmail.role = role;
            user = await existingEmail.save();
            await EmailVerificationModel.deleteMany({ user: user._id });
        }else{
            user = new userModel({
                name,
                email,
                password: hashedPassword,
                role,
                authProvider: "local",
                isEmailVerified: false
            });
            await user.save();
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpSalt = await bcrypt.genSalt(10);
        const otpHash = await bcrypt.hash(otp,otpSalt);

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const emailVer = new EmailVerificationModel({
            user : user._id,
            otpHash,
            expiresAt,
        })

        await emailVer.save();

        await sendEmail(user.email,"Verify Your Email - ClassTaskSpace",`Hello,\n\nThank you for registering with ClassTaskSpace.\n\nYour email verification OTP is:\n\n${otp}\n\nThis OTP is valid for 10 minutes. Please do not share this OTP with anyone.\n\nIf you did not create an account on ClassTaskSpace, you can safely ignore this email.\n\nRegards,\nClassTaskSpace Team`)
        return res.status(201).json({ success: true, message: "Registration successful. Please verify your email"});
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User with this email does not exist"
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }

        const emailVerification = await EmailVerificationModel.findOne({
            user: user._id
        });

        if (!emailVerification) {
            return res.status(400).json({
                success: false,
                message: "OTP not found. Please request a new OTP"
            });
        }

        if (emailVerification.expiresAt < new Date()) {
            await EmailVerificationModel.deleteOne({
                _id: emailVerification._id
            });

            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP"
            });
        }

        if (emailVerification.attempts >= 5) {
            await EmailVerificationModel.deleteOne({
                _id: emailVerification._id
            });

            return res.status(429).json({
                success: false,
                message: "Too many failed attempts. Please request a new OTP"
            });
        }

        const isOtpValid = await bcrypt.compare(
            otp.toString(),
            emailVerification.otpHash
        );

        if (!isOtpValid) {
            emailVerification.attempts += 1;
            await emailVerification.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        user.isEmailVerified = true;
        await user.save();

        await EmailVerificationModel.deleteOne({
            _id: emailVerification._id
        });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully. You can now login.",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User with this email does not exist" });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ success: false, message: "Email is already verified" });
        }

        const existingVerification = await EmailVerificationModel.findOne({
            user: user._id
        });

        if(existingVerification){
            const coolDownTime = 60 * 1000;
            const lastTimeOtpReceived = existingVerification.createdAt.getTime();
            const gap = Date.now() - lastTimeOtpReceived;

            if(gap < coolDownTime){
                const waitingTime = Math.ceil((coolDownTime - gap)/1000);
                return res.status(400).json({success: false, message: `Please wait ${waitingTime} seconds before requesting a new OTP`})
            }
            await EmailVerificationModel.deleteOne({
            _id : existingVerification._id
        });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const otpSalt = await bcrypt.genSalt(10);
        const otpHash = await bcrypt.hash(otp, otpSalt);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const emailVerification = new EmailVerificationModel({
            user: user._id,
            otpHash,
            expiresAt,
            attempts: 0
        });

        await emailVerification.save();

        await sendEmail(
            user.email,
            "Verify Your Email - ClassTaskSpace",
            `Hello,\n\nYour new email verification OTP is:\n\n${otp}\n\nThis OTP is valid for 10 minutes. Please do not share this OTP with anyone.\n\nIf you did not request a new OTP, you can safely ignore this email.\n\nRegards,\nClassTaskSpace Team`
        );

        return res.status(200).json({
            success: true,
            message: "A new verification OTP has been sent to your email"
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

const login = async (req, res) =>{
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ success: false, message: "Please enter all details" });
        }
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(401).json({ success: false, message: "User with this email does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

        const isVerified = user.isEmailVerified;
        if(!isVerified){
            return res.status(403).json({success:false, message:"Please verify your email before logging in"});
        }
        const token = jwt.sign({
            userId : user._id,
            name : user.name,
            email : user.email,
            role : user.role
        },process.env.JWT_SECRET, { expiresIn : "7d"});
        return res.status(200).json({ success: true, message: "Login Successful", token, role : user.role });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message })
    }
};

const googleLogin = async (req,res) => {
    try {
        const { idToken } = req.body;
        if(!idToken){
            return res.status(400).json({ success: false, message: "ID token missing" });
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience : process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, sub: GoogleId } = payload;

        const existingUser = await userModel.findOne({email});
        if(existingUser){
            const token = jwt.sign({
                userId : existingUser._id,
                name : existingUser.name,
                email : existingUser.email,
                role : existingUser.role
            }, process.env.JWT_SECRET, { expiresIn : "7d"})
            return res.status(200).json({ success: true, message: "Login successful", token, needsRole: false });
        }
        const tempToken = jwt.sign(
            { email, name, GoogleId },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );
        return res.status(200).json({ success: true, needsRole: true, tempToken });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

const completeGoogleSignUp = async (req, res) => {
    try {
        const { tempToken, role } = req.body;
        if (!tempToken || !role) {
            return res.status(400).json({ success: false, message: "Missing tempToken or role" });
        }
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        const { email, name, GoogleId } = decoded;
        const existingUser = await userModel.findOne({email});
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const user = new userModel({
            name,
            email,
            googleId: GoogleId,
            authProvider : "google",
            isEmailVerified : true,
            role
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({ success: true, message: "Account created", token });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export { register, verifyEmail, resendOtp, login, googleLogin, completeGoogleSignUp };