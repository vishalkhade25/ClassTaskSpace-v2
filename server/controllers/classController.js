import classModel from "../models/Class.js";

const createClass = async (req, res) => {
    try {
        const { name, subject } = req.body;
        let exists = true;
        let classCode;
        if(!name || !subject){
            return res.status(400).json({ success: false, message: "Please enter all details" });
        }
        while(exists){
            classCode = Math.random().toString(36).slice(2, 8).toUpperCase();
            exists = await classModel.findOne({ classCode });
        }
        const newClass = new classModel({
            name,
            subject,
            classCode,
            teacher : req.user.userId
        });
        await newClass.save();
        return res.status(201).json({ success:true,message:"Class created successfully", classCode })
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
};

const joinClass = async (req, res) => {
    try {
        const { classCode } = req.body;
        if(!classCode){
            return res.status(400).json({ success : false, message : "Please enter class code" })
        }
        const classExist = await classModel.findOne({classCode});
        if(!classExist){
            return res.status(404).json({ success:false, message: `no class found having classcode : ${classCode} `})
        }
        const studentExist = classExist.students.includes(req.user.userId);
        if(studentExist){
            return res.status(400).json({ success: false, message: `You already exist in class having classcode : ${classCode}` })
        }

        classExist.students.push(req.user.userId);
        await classExist.save();
        return res.status(200).json({ success: true, message:"Class joined" })
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
};

const getMyClassesAsTeacher = async (req, res) => {
    try {
        const classes = await classModel.find({teacher : req.user.userId});
        if(classes.length === 0){
            return res.status(200).json({success:true, message : "You have not created any class yet", classes});
        }
        return res.status(200).json({success:true, message:"Classes fetched succcessfully", classes});
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
}

const getMyClassesAsStudent = async (req, res) => {
    try {
        const classes = await classModel.find({students : req.user.userId});
        if(classes.length === 0){
            return res.status(200).json({success: true, message: "You have not joined any class yet", classes});
        }
        return res.status(200).json({success:true, message:"Classes fetched successfully",classes});
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
}

export { createClass, joinClass, getMyClassesAsTeacher, getMyClassesAsStudent };