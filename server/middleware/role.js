const role = (allowedRole) => {
    return (req,res,next)=>{
        if(req.user.role !== allowedRole){
            return res.status(403).json({success: false, message : "You are not allowed to do this action"})
        }
        next();
    }
}

export default role;