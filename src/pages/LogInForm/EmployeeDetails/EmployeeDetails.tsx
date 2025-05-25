import { employee_details } from "../../Leaves/SupabaseFunction/EmployeeDetails";

export async function EmployeeDetails():Promise<void>
{
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')

    const employeeDetails = await employee_details(username, password)
    localStorage.setItem('employeeID', employeeDetails[0].employeeid)
    localStorage.setItem('employeeName', employeeDetails[0].employeename)
    localStorage.setItem('employeeScheduleID', employeeDetails[0].employeescheduled)
    localStorage.setItem('managerID', employeeDetails[0].managerid)
    localStorage.setItem('managerName', employeeDetails[0].managername)
    localStorage.setItem('employeePosition', employeeDetails[0].employeeposition)
}