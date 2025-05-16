import "./css/App.css";
import LogInForm from "./pages/LogInForm/index";
import DashBoardEmployee from "./pages/Dashboard/Employee";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../src/auth/ProtectedRoute";
import AttendanceForm from "./pages/attendance/components/AttendanceForm";
import LeaveComponets from "./pages/Leaves/index";
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
        path="/dashboardEmployee"
        element={
          <ProtectedRoute>
            <DashBoardEmployee />
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
