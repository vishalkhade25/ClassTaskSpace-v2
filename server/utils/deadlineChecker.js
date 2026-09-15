import assignmentModel from "../models/Assignment.js";
import classModel from "../models/Class.js";
import submissionModel from "../models/Submission.js";
import sendEmail from "../config/mailer.js";

const sendDeadlineWarnings = async () => {
    const now = new Date();
    const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    const upcomingAssignment = await assignmentModel.find({
        deadline : {$gte : now, $lte : threeHoursLater},
        warningEmailSent : false
    }).populate("teacher", "name email");

    for ( const assignment of upcomingAssignment){
        try {
            const classData = await classModel.findById(assignment.class).populate("students", "name email");
            const submissions = await submissionModel.find({assignment : assignment._id}).populate("student", "name email");
            const studentsId = submissions.map((sub)=> sub.student._id.toString());
            const notSubmittedId = classData.students.filter((student)=> !studentsId.includes(student._id.toString()));

            await Promise.all(
                notSubmittedId.map((student)=>{
                    return sendEmail(
                        student.email,
                        `Deadline Approaching: ${assignment.title}`,
                        `Hi ${student.name},\n\nYou have not yet submitted "${assignment.title}".\n\nDeadline: ${assignment.deadline.toLocaleString()}\n\nPlease submit soon.\n\nRegards,\nHomework Portal`
                    )
                })
            )

            assignment.warningEmailSent = true;
            await assignment.save();
        } catch (error) {
            console.error(`Failed sending warnings for assignment ${assignment._id}:`, error.message);
        }
    }
}

const sendDeadlinePassedWarnings = async () => {
    const now = new Date();
    const pastAssignments = await assignmentModel.find({
        deadline : {$lt : now},
        deadlinePassedEmailSent : false
    }).populate("teacher", "name email");

    for ( const assignment of pastAssignments){
        try {
            const classData = await classModel.findById(assignment.class).populate("students", "name email");
            const submissions = await submissionModel.find({assignment : assignment._id}).populate("student", "name email");
            const studentsId = submissions.map((sub)=> sub.student._id.toString());
            const notSubmittedId = classData.students.filter((student)=> !studentsId.includes(student._id.toString()));

            await Promise.all(
                notSubmittedId.map((student)=>{
                    return sendEmail(
                        student.email,
                        `Deadline Passed: ${assignment.title}`,
                        `Hi ${student.name},\n\nThe deadline for "${assignment.title}" has passed and you have not submitted it.\n\nDeadline: ${assignment.deadline.toLocaleString()}\n\nPlease contact your teacher if you have any questions.\n\nRegards,\nHomework Portal`
                    )
                })
            );
            await sendEmail(assignment.teacher.email, `Deadline Passed: ${assignment.title}`, `Hi ${assignment.teacher.name},\n\nThe deadline for "${assignment.title}" has passed.\n\nDeadline: ${assignment.deadline.toLocaleString()}\n\nYou can now log in to review the full list of submitted and not-submitted students, or export it as a CSV.\n\nRegards,\nHomework Portal` )
            assignment.deadlinePassedEmailSent = true;
            await assignment.save();
        }catch (error) {
            console.error(`Failed sending deadline passed warnings for assignment ${assignment._id}:`, error.message);
        }
    }
}

export { sendDeadlineWarnings, sendDeadlinePassedWarnings };