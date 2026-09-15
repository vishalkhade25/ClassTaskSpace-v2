import assignmentModel from "../models/Assignment.js";
import submissionModel from "../models/Submission.js";
import classModel from "../models/Class.js";
import sendEmail from "../config/mailer.js";

const createAssignment = async (req, res) => {
    try {
        const { title, description, deadline } = req.body;
        const { classId } = req.params;
        if(!title || !deadline || !req.file ){
            return res.status(400).json({success : false, message : "Please enter all fields"});
        };
        const pdfUrl =req.file.path;
        const classData = await classModel.findById(classId).populate("students", "name email");
        if(!classData){
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        if(classData.teacher.toString() !== req.user.userId){
            return res.status(403).json({ success: false, message: "You do not own this class" });
        }
        const assignment = new assignmentModel({
            title,
            description,
            pdfUrl,
            class : classId,
            deadline,
            teacher : req.user.userId
        })
        await assignment.save();
        try {
            await Promise.all(
                classData.students.map((student) =>
                    sendEmail(
                        student.email,
                        `New Assignment Posted : ${title}`,
                        `Hi ${student.name},\n\nA new assignment has been posted in your class.\n\nAssignment: ${title}\nDescription: ${description}\nDeadline: ${deadline}\n\nPlease log in to submit your work before the deadline.\n\nRegards,\n${classData.name} — Homework Portal\n${classData.name} — Homework Portal`
                    )
                )
            );
        } catch (emailError) {
            console.log("Email notification failed:", emailError.message);
        }
        return res.status(201).json({ success: true, message: "Assignment Uploaded successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
};

const getAssignments = async (req, res) => {
    try {
        const { classId } = req.params;
        const classData = await classModel.findById(classId);
        if(!classData){
            return res.status(404).json({success:false, message: "No class found"})
        }
        if (req.user.role === "teacher") {
            if (classData.teacher.toString() !== req.user.userId) {
                return res.status(403).json({ success: false, message: "You do not own this class" });
            }
        } else if (req.user.role === "student") {
            if (!classData.students.includes(req.user.userId)) {
                return res.status(403).json({ success: false, message: "You are not enrolled in this class" });
            }
        }
        const assignments = await assignmentModel.find({class : classId});
        if(assignments.length === 0){
            return res.status(200).json({success: true, message: "Currently there is no assignment in this class", assignments});
        }
        return res.status(200).json({success: true, message: "Assignment fetched successfully", assignments});
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
}

const getAssignmentById = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await assignmentModel.findById(assignmentId);
        if(!assignment){
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }
        if (req.user.role === "teacher") {
            if (assignment.teacher.toString() !== req.user.userId) {
                return res.status(403).json({ success: false, message: "You do not own this class" });
            }
        }else if (req.user.role === "student") {
            const classData = await classModel.findById(assignment.class);
            if (!classData || !classData.students.includes(req.user.userId)) {
                return res.status(403).json({ success: false, message: "You are not enrolled in this class" });
            }
        }
        return res.status(200).json({ success: true, message:"Details fetched successfully", assignment });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
}

const deleteAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const userId = req.user.userId;
        const assignment = await assignmentModel.findById(assignmentId);
        if(!assignment){
            return res.status(404).json({success: false, message : "Assignment Not Found"});
        }
        if(assignment.teacher.toString() !== userId){
            return res.status(403).json({success: false, message : "You are not allowed to this action"});
        }
        await submissionModel.deleteMany({assignment : assignmentId});
        await assignmentModel.findByIdAndDelete(assignmentId);
        res.status(200).json({success: true, message : "Assignment deleted successfully"});
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
}

export { createAssignment, getAssignments, getAssignmentById, deleteAssignment };