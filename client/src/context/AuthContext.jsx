import { useContext, createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(()=>{
        const savedToken = localStorage.getItem("token");
        if(savedToken){
            return jwtDecode(savedToken)
        }
        return null;
    })

    const login = (token) => {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        setToken(token);
        localStorage.setItem("token",token);
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        
    }

    const isAuthenticated = !!token

    return(
        <AuthContext.Provider value={{token, user, login, logout, isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;