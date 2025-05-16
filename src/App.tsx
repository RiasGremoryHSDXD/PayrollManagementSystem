import "./css/App.css";
import LogInForm from "./pages/LogInForm/index";
import DashBoard from "./pages/attendance/components/AttendanceForm";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../src/auth/ProtectedRoute";
import AttendanceForm from "./pages/attendance/components/AttendanceForm";
import LeaveComponets from "./pages/Leaves/index";
import Payroll from "./pages/Payroll/components/payroll";
function App() {
  return (
    <Routes>
      {/*Log In Form Componets*/}
      <Route
        path="/"
        element={
          <div className="flex justify-center items-center h-screen bg-slate-200">
            <LogInForm />
          </div>
        }
      />

      {/*Employee Dashboard*/}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashBoard />
          </ProtectedRoute>
        }
      />

      {/*Attendance Form*/}
      <Route path="/Attendance" element={
        <ProtectedRoute>
          <div className="flex justify-center items-center h-screen bg-slate-200">
            <AttendanceForm />
          </div>      
        </ProtectedRoute>
      } />

      {/*Leave Form*/}
      <Route path="/leave-request" element={
        <ProtectedRoute>
            <LeaveComponets />
        </ProtectedRoute>
      } />

      {/*Payroll Form*/}
      <Route
        path="/payroll"
        element={
          <ProtectedRoute>
            <div className="flex justify-center items-center h-screen bg-slate-200">
              <Payroll />
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
} 



export default App;
