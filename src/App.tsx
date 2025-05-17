import "./css/App.css";
import LogInForm from "./pages/LogInForm/index";
import DashBoardEmployee from "./pages/Dashboard/Employee";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../src/auth/ProtectedRoute";
import Payroll from "./pages/Payroll/components/payroll"

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
