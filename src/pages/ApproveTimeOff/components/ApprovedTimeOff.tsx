import React from 'react'

export type EmployeeDetailsProps = {
  first_name: string
  last_name: string
  start_date: string       // ISO date
  end_date: string         // ISO date
  day_requested: string    // ISO timestamp
  leave_types: string
  leave_status: string
  employee_schedule_id: number   // ← keep this
  leave_id: number               // ← and this
  onApprove?: (leaveId: number) => void
  onReject?: (leaveId: number) => void
}

const handleReject = () => 
    {
        alert("Reject Employee, Referesh the website to remove the pop up")
    }

const handleApprove = () => 
    {
        alert("Approve Employee,, Referesh the website to remove the pop up")
    }

export default function ApprovedTimeOff({
  first_name,
  last_name,
  start_date,
  end_date,
  day_requested,
  leave_types,
  leave_status,
  employee_schedule_id,
  leave_id,
  onApprove,
  onReject,
}: EmployeeDetailsProps) {
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <h2 className="text-xl font-semibold">Time Off Request</h2>
      <div className="space-y-1">
        <p><span className="font-medium">Employee:</span> {first_name} {last_name}</p>
        <p><span className="font-medium">Period:</span> {start_date} to {end_date}</p>
        <p><span className="font-medium">Requested On:</span> {new Date(day_requested).toLocaleString()}</p>
        <p><span className="font-medium">Type:</span> {leave_types}</p>
        <p><span className="font-medium">Status:</span> {leave_status}</p>
      </div>
      <div className="flex justify-between space-x-3 pt-4">        
            <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 transition"
            >
                Reject
            </button>
            <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-100 text-green-600 font-medium rounded-lg hover:bg-green-200 transition"
            >
                Approve
            </button>
        </div>
    </div>
  )
}
