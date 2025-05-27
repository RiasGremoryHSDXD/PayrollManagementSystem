import "./css/App.css";
import LogInForm from "./pages/LogInForm/index";
import DashBoardEmployee from "./pages/DashBoard/Employee"
import DashboardManager from "./pages/DashBoard/Manager";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../src/auth/ProtectedRoute";
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
      Employee Dashboard
      <Route
        path="/dashboardEmployee"
        element={
          <ProtectedRoute>
            <DashBoardEmployee />
          </ProtectedRoute>
        }
      />
      {/*Manager Dashboard*/}
      <Route
        path="/dashboardManager"
        element={
          <ProtectedRoute>
            <DashboardManager />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
