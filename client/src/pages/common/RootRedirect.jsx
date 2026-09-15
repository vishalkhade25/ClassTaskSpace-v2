import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"

const RootRedirect = () => {
    const { isAuthenticated, user } = useAuth();

    if(!isAuthenticated){
        return <Navigate to="/login" replace />;
    }

    if(user.role === "teacher"){
        return <Navigate to="/teacher/dashboard" replace />
    }

    return <Navigate to="/student/dashboard" replace />
}

export default RootRedirect;