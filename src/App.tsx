import "./css/App.css";
import LogInForm from "./pages/LogInForm/index";
import DashBoardEmployee from "./pages/Dashboard/Employee";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../src/auth/ProtectedRoute";
<<<<<<< HEAD
import AttendanceForm from "./pages/attendance/components/AttendanceForm";
import LeaveComponets from "./pages/Leaves/index";
import Payroll from "./pages/Payroll/components/payroll";
=======

>>>>>>> 21c918a7864534d437d59fb7d577369084110e86
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
