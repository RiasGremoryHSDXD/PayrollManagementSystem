import { useEffect, useState } from "react";
import {
  IdCard,
  User,
  Briefcase,
  Building,
  ClockIcon,
  MapPin,
} from "lucide-react";
import { getAttendanceHistory } from "../SupabaseFunction/RetieveAttedanceEmployee";
import { employeeCompensationDetails } from "../SupabaseFunction/CompensationDetails";
import { approvedRejectAttendance } from "../SupabaseFunction/ApprovedAttendance";
import EmployeeLeaveHistory from "./EmployeeLeaveHistory";
import PayrollApproved from "./PayrollApproved";

interface DisplayInfo {
  employee_id: number;
  first_name: string;
  last_name: string;
  position_title: string;
  department_name: string;
  shift_start_time: string;
  shift_end_time: string;
  employee_schedule_id: number;
}

interface AttendanceRecord {
  attendanceid: string
  attendancedate: string;
  timein: string;
  timeout: string;
  total_work_hours: string;
  schedule_work_hours: string;
  over_time_work : string;
  loc_clock_in: string;
  loc_clock_out: string;
  status: string;
}

export default function EmployeeInfo({
  employee_id,
  first_name,
  last_name,
  position_title,
  department_name,
  shift_start_time,
  shift_end_time,
  employee_schedule_id,
}: DisplayInfo) {
  const [baseSalary, setBaseSalary] = useState<number>(0);
  const [bonusRate, setBonusRate] = useState<number>(0);
  const [commissionRate, setCommissionRate] = useState<number>(0);
  const [overTimeRate, setOverTimeRate] = useState<number>(0);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(
    null
  );
  const [clickAttendanceHistory, setClickAttendanceHistory] =
    useState<boolean>(true);
  const [clickApprovalPayroll, setClickApprovalPayroll] =
    useState<boolean>(false);

  const [employeeID] = useState<number>(
    parseInt(localStorage.getItem("employeeID")!, 10)
  );

  const getCompensationDetails = async () => {
    const data = await employeeCompensationDetails(employee_schedule_id);
    if (data?.length) {
      setBaseSalary(data[0].base_salary);
      setBonusRate(data[0].bonus_rate);
      setCommissionRate(data[0].commission_rate);
      setOverTimeRate(data[0].over_time_rate);
    }
  };

  const getAttendance = async () => {
    const records = await getAttendanceHistory(
      employee_schedule_id,
      employeeID,
      null
    );
    setAttendance(records || []);
  };

  const handleApprovedAttendance = async (
    attendance_id: number,
    status: string
  ) => {
    await approvedRejectAttendance(attendance_id, status);
    getAttendance();
    setSelectedRecord(null);
  };

  useEffect(() => {
    getCompensationDetails();
    getAttendance();
  }, []);

  const handleApprovedPayroll = () => {
    setClickApprovalPayroll(true);
  };

  const statusStyles: Record<string, string> = {
    Approved: " bg-green-100 text-green-800",
    Rejected: "bg-red-100   text-red-800",
  };


  return (
    <>
      <div className="flex flex-col lg:flex-row bg-gray-50 rounded-2xl shadow-xl overflow-hidden w-[95vw] h-[95vh]">
        {/* Left Sidebar */}
        <div className="lg:w-1/3 bg-white p-4 space-y-4">
          <div className="flex items-center space-x-3">
            <IdCard className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
            <span className="text-base md:text-lg font-semibold">
              ID: {employee_id}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
            <span className="text-base md:text-lg font-semibold">
              {first_name} {last_name}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />
            <span className="text-base">{position_title}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Building className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
            <span className="text-base">{department_name}</span>
          </div>
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
            <span className="text-base">
              {shift_start_time} - {shift_end_time}
            </span>
          </div>

          <div className="mt-3 p-3 bg-blue-50 rounded-lg shadow-inner">
            <h3 className="text-base font-semibold text-blue-800 mb-2">
              Compensation
            </h3>
            <div className="space-y-1.5 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span>Base Salary (Per Hour)</span>
                <span className="font-medium">
                  ₱{baseSalary.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Bonus Rate</span>
                <span className="font-medium">{bonusRate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Commission Rate</span>
                <span className="font-medium">{commissionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Overtime Rate</span>
                <span className="font-medium">{overTimeRate}%</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setClickAttendanceHistory(true)}
              className="flex-1 px-4 py-2.5 text-slate-700 bg-white border border-slate-200 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
            >
              Attendance History
            </button>
            <button
              onClick={() => setClickAttendanceHistory(false)}
              className="flex-1 px-4 py-2.5 text-slate-700 bg-white border border-slate-200 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
            >
              Leave History
            </button>
          </div>

          <div className="mt-3">
            <button
              onClick={handleApprovedPayroll}
              className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Approved Payroll
            </button>
          </div>
        </div>

        {/* Right Content - Attendance */}

        {clickAttendanceHistory && (  
          <div className="lg:w-2/3 p-8 overflow-y-auto bg-gray-50">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold lg:font-bold text-gray-800 mb-6">
              Attendance History
            </h2>
            <table className="min-w-full bg-white rounded-2xl shadow">
              <thead>
                <tr className="bg-indigo-100">
                  {[
                    "DATE",
                    "CLOCK IN",
                    "TIME OUT",
                    "TOTAL HOURS",
                    "OT",
                    "STATUS",
                  ].map((label) => (
                    <th
                      key={label}
                      className="py-3 px-6 text-left text-xs md:text-sm font-semibold uppercase text-indigo-700 tracking-wide whitespace-nowrap"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendance.map((rec, idx) => (
                  <tr
                    key={idx}
                    className={`border-b transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50 cursor-pointer`}
                    onClick={() => setSelectedRecord(rec)}
                  >
                    <td className="py-2 px-4 md:py-3 md:px-6 whitespace-nowrap text-sm text-gray-700">
                      {new Date(rec.attendancedate).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-2 px-4 md:py-3 md:px-6 text-sm text-gray-700">
                      {rec.timein ?? "--:--"}
                    </td>
                    <td className="py-2 px-4 md:py-3 md:px-6 text-sm text-gray-700">
                      {rec.timeout ?? "--:--"}
                    </td>
                    <td className="py-2 px-4 md:py-3 md:px-6">
                      <span
                        className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs md:text-sm  ${
                          rec.total_work_hours != null &&
                          rec.schedule_work_hours != null &&
                          rec.total_work_hours < rec.schedule_work_hours
                            ? "bg-red-100 text-red-700"
                            : ""
                        }`}
                      >
                        {rec.total_work_hours ?? "--:--"}
                      </span>
                    </td>
                    <td className="py-2 px-4 md:py-3 md:px-6 text-sm text-gray-700">
                      {rec.over_time_work ?? "--:--"}
                    </td>
                    <td className="py-2 px-4 md:py-3 md:px-6">
                      <span
                        className={`inline-block px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium ${
                          statusStyles[rec.status] ??
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {attendance.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-gray-400 italic"
                    >
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {clickAttendanceHistory == false && (
          <EmployeeLeaveHistory employee_id={employee_id} />
        )}
      </div>

      {/* Modal for Location Details */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-lg overflow-hidden w-80 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {/* Attendance ID */}
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 uppercase">
                Attendance ID # {selectedRecord.attendanceid}
              </h4>
            </div>

            <h3 className="text-xl font-semibold mb-4">Location Details</h3>
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="h-6 w-6 text-green-500" />
              <span className="font-medium">Clock In:</span>
            </div>
            <p className="ml-8 text-gray-700 mb-4">
              {selectedRecord.loc_clock_in}
            </p>

            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="h-6 w-6 text-red-500 rotate-45" />
              <span className="font-medium">Clock Out:</span>
            </div>
            <p className="ml-8 text-gray-700 mb-6">
              {selectedRecord.loc_clock_out}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  handleApprovedAttendance(
                    parseInt(selectedRecord.attendanceid!, 10),
                    "Rejected"
                  );
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  handleApprovedAttendance(
                    parseInt(selectedRecord.attendanceid!, 10),
                    "Approved"
                  );
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approved Payroll*/}
      {clickApprovalPayroll && (
        <PayrollApproved 
          employeeID={employee_id}
          employeeName={`${first_name} ${last_name}`}
          position={position_title}
          department={department_name}
          shift_start_time={shift_start_time}
          shift_end_time={shift_end_time}
          bonusRate={bonusRate}
          commissionRate={commissionRate}
          overTimeRate={overTimeRate}
          baseSaraly={baseSalary}
          managerID={employeeID}
          employee_schedule_id={employee_schedule_id}
          onClose={() => setClickApprovalPayroll(false)} 
        />
      )}
    </>
  );
}
