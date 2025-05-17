import './css/Leave.css'
import NewRequest from "./components/NewRequest"
import Leave from "./components/LeaveCard"
import RequestHistory from './components/RequestHistory'
import { useAuth } from '../../auth/AuthContext'
import { employee_details } from './EmployeeDetail/EmployeeDetails'
import { get_used_leave } from './SupabaseFunction/GetUsedLeave'
import { get_max_leave_day } from './SupabaseFunction/GetTotalLeave'
import { useEffect, useState } from 'react'

export default function index() {
  const [vacationUsedLeave, setVactionUseLeave] = useState<number>(0)
  const [vacationTotalLeave, setVacationTotalLeave] = useState<number>(0)
  const [sickUsedLeave, setSickLeave] = useState<number>(0)
  const [sickTotalLeave, setSickTotalLeave] = useState<number>(0)
  const [personalUsedLeave, setPersonalLeave] = useState<number>(0)
  const [personalTotalLeave, setPersonalTotalLeave] = useState<number>(0)
  const [employeeScheID, setEmployeeID] = useState<number | null>(null)
  const { userEmail, userPassword } = useAuth()
  

  useEffect(() => {
    console.log(localStorage.getItem('username'))
    console.log(localStorage.getItem('password'))
  })

  useEffect(() => {
    employee_details(userEmail, userPassword)
      .then(result => setEmployeeID(result[0].employeescheduled))
      .catch(console.error)
  }, [userEmail, userPassword])

  useEffect(() => {
    
    if(employeeScheID === null) return

    const fetchLeaves = () => {
      get_used_leave(employeeScheID, 'Vacation')
        .then(result => setVactionUseLeave(result[0].total_leave))
      get_used_leave(employeeScheID, 'Sick Leave')
        .then(result => setSickLeave(result[0].total_leave))
      get_used_leave(employeeScheID, 'Personal Leave')
        .then(result => setPersonalLeave(result[0].total_leave))
    }

    fetchLeaves()

    const intervalID = setInterval(fetchLeaves, 2000)
    return () => clearInterval(intervalID)
  }, [employeeScheID])

  useEffect(() => {
    
    if(employeeScheID === null) return

    const fetchTotalLeaves = () => {
      get_max_leave_day('Vacation')
        .then(result => setVacationTotalLeave(result))
      get_max_leave_day('Sick Leave')
        .then(result => setSickTotalLeave(result))
      get_max_leave_day('Personal Leave')
        .then(result => setPersonalTotalLeave(result))
    }

    fetchTotalLeaves()

    const intervalID = setInterval(fetchTotalLeaves, 2000)
    return () => clearInterval(intervalID)
  }, [employeeScheID])



  return (
    <div className='flex flex-col gap-4'>
      <NewRequest />

      <div className='flex flex-row gap-4 flex-wrap w-full justify-center'> 
        <Leave leaveType="Vacation" used={vacationUsedLeave} total={vacationTotalLeave}/>
        <Leave leaveType="Sick" used={sickUsedLeave} total={sickTotalLeave}/>
        <Leave leaveType="Personal" used={personalUsedLeave} total={personalTotalLeave}/>
      </div>

      <RequestHistory />
    </div>
  )
}
