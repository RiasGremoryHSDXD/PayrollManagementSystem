import './css/App.css'
import LogInForm from './pages/LogInForm/index'
import EmployeeLogIn from './pages/DashBoard/Employee/index'
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../src/auth/ProtectedRoute';
import AttendanceForm from './attendance/components/AttendanceForm'

function App(){
  return(
    <Routes>

      {/*Log In Form Componets*/}
      <Route path="/" element={
        <div className="flex justify-center items-center h-screen bg-slate-200">
          <LogInForm />
        </div>        
      } />

      {/*Employee Dashboard*/}
      <Route path="/employee" element={
        <ProtectedRoute>
          <EmployeeLogIn />
        </ProtectedRoute>
      } />

      {/*Attendance Form*/}
      {/*Log In Form Componets*/}
      <Route path="/" element={
        <div className="flex justify-center items-center h-screen bg-slate-200">
          <AttendanceForm />
        </div>        
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App