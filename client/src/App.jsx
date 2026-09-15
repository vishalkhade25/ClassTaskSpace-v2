import { Routes, Route } from "react-router-dom";
import RootRedirect from "./pages/common/RootRedirect";
import Login from "./pages/common/Login";
import Register from "./pages/common/Register";
import VerifyOtp from "./pages/common/VerifyOtp";
import AssignmentDetailStudent from "./pages/student/AssignmentDetailStudent";
import ClassDetailStudent from "./pages/student/ClassDetailStudent";
import JoinClass from "./pages/student/JoinClass";
import StudentDashBoard from "./pages/student/StudentDashBoard";
import AssignmentDetailTeacher from "./pages/teacher/AssignmentDetailTeacher";
import ClassDetailTeacher from "./pages/teacher/ClassDetailTeacher";
import CreateAssignment from "./pages/teacher/CreateAssignment";
import CreateClass from "./pages/teacher/CreateClass";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CompleteProfile from "./pages/common/CompleteProfile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<RootRedirect/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/verify-otp" element={<VerifyOtp/>}/>
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/teacher/dashboard" element={<ProtectedRoute><TeacherDashboard/></ProtectedRoute>}/>
          <Route path="/teacher/class/create" element={<ProtectedRoute><CreateClass/></ProtectedRoute>}/>
          <Route path="/teacher/class/:classId" element={<ProtectedRoute><ClassDetailTeacher/></ProtectedRoute>}/>
          <Route path="/teacher/class/:classId/assignment/create" element={<ProtectedRoute><CreateAssignment/></ProtectedRoute>}/>
          <Route path="/teacher/assignment/:assignmentId" element={<ProtectedRoute><AssignmentDetailTeacher/></ProtectedRoute>}/>
          <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashBoard/></ProtectedRoute>}/>
          <Route path="/student/class/join" element={<ProtectedRoute><JoinClass/></ProtectedRoute>}/>
          <Route path="/student/class/:classId" element={<ProtectedRoute><ClassDetailStudent/></ProtectedRoute>}/>
          <Route path="/student/assignment/:assignmentId" element={<ProtectedRoute><AssignmentDetailStudent/></ProtectedRoute>}/>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;