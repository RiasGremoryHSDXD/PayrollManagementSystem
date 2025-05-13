import AttendanceForm from './attendance/components/AttendanceForm'
import './css/App.css'
import LogInForm from './pages/LogInForm/index'

function App(){
  return(
    <div className='flex justify-center items-center h-screen bg-slate-200'>
      <AttendanceForm/>
    </div>
  )
}

export default App