import { useState } from "react";
import { User, Briefcase, Building, ClockIcon } from "lucide-react";
import { getAttendanceHistory } from "../SupabaseFunction/RetieveAttedanceEmployee";

interface DisplayInfo {
  first_name: string;
  last_name: string;
  position_title: string;
  department_name: string;
  shift_start_time: string;
  shift_end_time: string;
  employee_schedule_id: number;
}

interface AttendanceRecord {
  attendancedate: string;
  timein: string;
  timeout: string;
  ot: number;
  status: string;
}

export default function EmployeeInfo({
  first_name,
  last_name,
  position_title,
  department_name,
  shift_start_time,
  shift_end_time,
  employee_schedule_id,
}: DisplayInfo) {
  // ─── Hooks must be inside the component body ──────────────────────────────
  const [userClickTimeSheet, setUserClickTimeSheet] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // ─── Handler that fetches and flips to “timesheet” view ───────────────────
  const handleTimeSheetClick = async () => {
    const data = await getAttendanceHistory(employee_schedule_id);
    console.log(data)
    if (data) {
      setAttendanceRecords(data);
      setUserClickTimeSheet(true);
    }
  };

  // ─── If they clicked “Time Sheet”, show the table ────────────────────────
  if (userClickTimeSheet) {
    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full p-6">
        <button
          onClick={() => setUserClickTimeSheet(false)}
          className="text-gray-500 hover:text-gray-700 mb-4"
        >
          ← Back
        </button>
        <h3 className="text-xl font-semibold mb-4">
          Attendance for {first_name} {last_name}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">In</th>
                <th className="p-2 border">Out</th>
                <th className="p-2 border">OT</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2 border">{r.attendancedate}</td>
                  <td className="p-2 border">{r.timein}</td>
                  <td className="p-2 border">{r.timeout}</td>
                  <td className="p-2 border">{r.ot}</td>
                  <td className="p-2 border">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── Default: show the employee card with the “Time Sheet” button ────────
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full">
      <div className="flex p-6 items-center">
        <div className="flex-shrink-0 bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <div className="ml-6 flex-1">
          <h3 className="text-2xl font-semibold text-gray-900">
            {first_name} {last_name}
          </h3>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
              <span>{position_title}</span>
            </div>
            <div className="flex items-center">
              <Building className="h-5 w-5 mr-2 text-gray-500" />
              <span>{department_name}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
              <span>
                {shift_start_time} — {shift_end_time}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500">
                Schedule ID: {employee_schedule_id}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 text-right">
        <button
          onClick={handleTimeSheetClick}
          className="inline-block whitespace-nowrap px-5 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        >
          Time Sheet
        </button>
      </div>
    </div>
  );
}
