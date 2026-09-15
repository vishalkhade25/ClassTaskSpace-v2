import submissionModel from "../models/Submission.js";
import assignmentModel from "../models/Assignment.js";
import classModel from "../models/Class.js";
import { Parser } from "json2csv";
import sendEmail from "../config/mailer.js";

const submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please attach a PDF" });
        }
        const pdfUrl =req.file.path;
        const assignmentData = await assignmentModel.findById(assignmentId).populate("teacher", "name email");
        if(!assignmentData){
            return res.status(404).json({ success: false, message : "No assignment foud" });
        }
        const classData = await classModel.findById(assignmentData.class).populate("students", "name email");
        const isEnrolled = classData.students.some((student) => student._id.toString() === req.user.userId);
        if (!isEnrolled) {
            return res.status(403).json({ success: false, message: "You are not enrolled in this class" });
        }
        const isLate = new Date() > assignmentData.deadline ? true : false;
        const submission = await submissionModel.findOneAndUpdate(
            { assignment: assignmentId, student: req.user.userId },
            { pdfUrl, submittedAt: new Date(), isLate },
            { upsert: true, new: true }
        );
        await sendEmail(`${assignmentData.teacher.email}`,`New Submission: ${req.user.name} — ${assignmentData.title}`, `Hi ${assignmentData.teacher.name},\n\n${req.user.name} has submitted their work for the assignment "${assignmentData.title}".\n\nSubmitted at: ${new Date().toLocaleString()}\nStatus: ${isLate ? "Late" : "On time"}\n\nYou can review the submission by logging into the portal.\n\nRegards,\nHomework Portal`)
        return res.status(201).json({ success: true, message : "Assignment submitted successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
}

const getSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignmentData = await assignmentModel.findById(assignmentId);
        if(!assignmentData){
            return res.status(404).json({ success: false, message : "No assignment foud" });
        }
        const isTeacher = assignmentData.teacher.toString() === req.user.userId ? true : false;
        if(!isTeacher){
            return res.status(403).json({ success: false, message: "You are not allowed to see submission details of this assg" })
        }
        const submissions = await submissionModel.find({assignment : assignmentId}).populate("student","name email");
        if(submissions.length === 0){
            return res.status(200).json({ success: true,message:"Currently submission list is empty", submissions, notSubmitted : [], assignment : assignmentData });
        }
        const classData = await classModel.findById(assignmentData.class).populate("students","name  email");
        if(!classData){
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        const submittedStudentIds = submissions.map((sub)=> sub.student._id.toString());
        const notSubmitted = classData.students.filter((student)=> !submittedStudentIds.includes(student._id.toString()));
        return res.status(200).json({ success:true, message: "List fetched", submissions, notSubmitted, assignment : assignmentData });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
}

const gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { marks } = req.body;
        if(marks === undefined || marks === null){
            return res.status(400).json({ success:false, message:"Please enter the marks" });
        }
        if(marks > 10){
            return res.status(400).json({ success:false, message:"Please enter valid marks (0-10)" });
        }
        const submissionData = await submissionModel.findById(submissionId).populate("student","name email");
        if(!submissionData){
            return res.status(404).json({ success: false, message: "Submission not found" });
        }
        const assignmentData = await assignmentModel.findById(submissionData.assignment);
        if(!assignmentData){
            return res.status(404).json({ success: false,message: "Assignment Not Found" });
        }
        const isTeacher = assignmentData.teacher.toString() === req.user.userId ? true : false;
        if(!isTeacher){
            return res.status(403).json({ success: false, message: "You are not allowed to grade this submission" });
        }
        await submissionModel.findByIdAndUpdate(submissionId, { marks, gradedAt : new Date() });
        await sendEmail(`${submissionData.student.email}`, `Graded Submission: ${assignmentData.title}`, `Hi ${submissionData.student.name},\n\nYour submission for the assignment "${assignmentData.title}" has been graded.\n\nMarks: ${marks}\nGraded at: ${new Date().toLocaleString()}\n\nPlease log in to view your grade and feedback.\n\nRegards,\nHomework Portal`)
        return res.status(200).json({ success: true, message: "Submission graded successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

const exportSubmissionsCSV = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignmentData = await assignmentModel.findById(assignmentId);
        if(!assignmentData){
            return res.status(404).json({ success: false, message : "No assignment found" });
        }
        const isValidTeacher = req.user.userId === assignmentData.teacher.toString() ? true : false;
        if(!isValidTeacher){
            return res.status(403).json({ success: false, message: "You are not allowed to see submission details of this assg" })
        }
        const submissionData = await submissionModel.find({assignment : assignmentId}).populate("student","name email");
        const classData = await classModel.findById(assignmentData.class).populate("students", "name email");
        if(!classData){
            return res.status(404).json({ success: false, message : "No class found" });
        }
        const submittedStudents = submissionData.map((submission)=> submission.student._id.toString());
        const notSubmittedStudents = classData.students.filter((student)=> !submittedStudents.includes(student._id.toString()));
        
        const rows = [
            ...submissionData.map((sub)=>({
                name: sub.student.name,
                email : sub.student.email,
                status : "Submitted"
            })),
            ...notSubmittedStudents.map((student)=>({
                name : student.name,
                email : student.email,
                status : "Not Submitted"
            }))
        ];
        const parser = new Parser({fields : ["name","email","status"]});
        const csv = parser.parse(rows);
        res.header("Content-Type", "text/csv");
        res.attachment("submissions.csv");
        return res.send(csv);
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

const getMySubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const mySubmissions = await submissionModel.findOne({assignment : assignmentId, student : req.user.userId});
        if(!mySubmissions) {
            return res.status(200).json({success:true, message:"You have not submitted any assignment yet",mySubmissions});
        }
        return res.status(200).json({success : true, message: "Submissions fetched successfully", mySubmissions});
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export { submitAssignment, getSubmissions, gradeSubmission, exportSubmissionsCSV, getMySubmissions };