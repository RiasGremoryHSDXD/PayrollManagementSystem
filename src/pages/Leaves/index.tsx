import './css/Leave.css'
import NewRequest from "./components/NewRequest"
import Leave from "./components/LeaveCard"

export default function index() {

  return (
    <div className='flex flex-col items-end gap-4'>
      <NewRequest />

      <div className='flex flex-row gap-4 flex-wrap w-full justify-center'> 
        <Leave leaveType="Vacation" used={5} total={15}/>
        <Leave leaveType="Sick" used={2} total={10}/>
        <Leave leaveType="Personal" used={1} total={3}/>
      </div>
    </div>
  )
}
