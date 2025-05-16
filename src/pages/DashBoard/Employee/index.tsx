import NavigationBar from '../componets/NavigationBar'
import DashBoardHeader from '../componets/DashBoardHeader'
import AttendanceForm from '../../attendance/components/AttendanceForm'
import LeaveForm from '../../Leaves/index'
export default function index() {

  return (
    <div className='flex'>
      <NavigationBar/>
      <div className='w-[80vw]'>
        <DashBoardHeader/>
        <AttendanceForm/>
      </div>
    </div>
  )
}
  