import { useEffect, useState } from "react";
import "../css/AttendanceForm.css";
import { useAuth } from "../../../auth/AuthContext";
import { employee_details } from "../../Leaves/EmployeeDetail/EmployeeDetails";
import { getShiftRotations } from "../components/AttedanceDatabase";
import supabase from "../../../config/SupabaseClient";

export default function AttendanceForm() {
  const [time, setTime] = useState<Date>(new Date());
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
  const [employeeScheduleID, setEmployeeScheduleID] = useState<number>(0);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [shiftDate, setShiftDate] = useState<string>("");
  const [shiftStart, setShiftStart] = useState<number>(0);
  const [shiftEnd, setshiftEnd] = useState<number>(0);
  const { userEmail, userPassword } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const displayUserInfo = async () => {
    const result = await employee_details(userEmail, userPassword);
    setEmployeeScheduleID(result[0].employeescheduled);

    const shiftTime = await getShiftRotations(result[0].employeename);

    console.log("ShiftTime", shiftTime);
    setShiftDate(shiftTime[0].shiftdate);
    setShiftStart(shiftTime[0].starttime);
    setshiftEnd(shiftTime[0].endtime);

    console.log("Employee Name", result);
  };

  displayUserInfo();
  const handleClockAction = async () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // YYYY-MM-DD

    if (!isClockedIn) {
      // Clocking in → INSERT
      const { error } = await supabase.from("attendance").insert([
        {
          employeescheduled: employeeScheduleID,
          attendancedate: today,
          timein: now,
          timeout: null,
        },
      ]);

      if (error) {
        console.error("Clock-in error:", error.message);
      } else {
        setClockInTime(now);
        setClockOutTime(null);
        setIsClockedIn(true);
      }
    } else {
      // Clocking out → UPDATE
      const { error } = await supabase
        .from("attendance")
        .update({ timeout: now })
        .eq("employeescheduled", employeeScheduleID)
        .eq("attendancedate", today);

      if (error) {
        console.error("Clock-out error:", error.message);
      } else {
        setClockOutTime(now);
        setIsClockedIn(false);
      }
    }
  };

  // Formatted time display
  const formattedDate = time.toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Clock in Date
  const clockInDate = time.toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // CLock in Day
  const clockInDay = time.toLocaleDateString("en-PH", {
    weekday: "short",
  });

  const TotalHours = () => {
    if (!clockInTime || !clockOutTime) return "--:--:--";

    const diffInMs = clockOutTime.getTime() - clockInTime.getTime();
    const totalSeconds = Math.floor(diffInMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${hours} hrs ${minutes} mins`;
  };

  const CalculateOvertime = (
    clockInTime: Date | null,
    clockOutTime: Date | null
  ): string => {
    if (!clockInTime || !clockOutTime) return "--:--:--";

    const diffInMs = clockOutTime.getTime() - clockInTime.getTime();
    const totalMinutes = Math.floor(diffInMs / (1000 * 60));

    const regularMinutes = 8 * 60;
    const overtimeMinutes = totalMinutes - regularMinutes;

    if (overtimeMinutes <= 0) return "N/A";

    const overtimeHours = Math.floor(overtimeMinutes / 60);
    const overtimeMins = overtimeMinutes % 60;

    return `${overtimeHours} hrs ${overtimeMins} min)`;
  };

  return (
    <div className="main-container">
      <div className="right-area">
        {/* Main content */}
        <main className="main-area">
          <h1>Attendance</h1>
          <h1>Employee Sche ID {employeeScheduleID}</h1>
          <h1>Shift Date: {shiftDate}</h1>
          <h1>Shift Start: {shiftStart}</h1>
          <h1>Shift End: {shiftEnd}</h1>
          <div className="attendance-UI-display">
            <div className="attendance-function">
              <div className="time-display">
                <h3>Current Time</h3>
                <div className="current-time">{time.toLocaleTimeString()}</div>
                <div className="text-gray-600">{formattedDate}</div>
              </div>
              <div
                className={`status-area ${
                  isClockedIn
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-50 text-gray-500"
                }`}
              >
                <div className="status">
                  <h4 className="text-gray-500 strong">Status</h4>
                  <p
                    className={
                      isClockedIn
                        ? "text-green-600 text-base"
                        : "text-gray-600 text-base"
                    }
                  >
                    {isClockedIn ? " Clocked In " : "Clocked Out"}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <div className="clockIn-Out-area">
                <div className="clockIn-time">
                  <p className="clock-label">Clock in</p>
                  <p className="clock-time-display">
                    {clockInTime
                      ? clockInTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--:--:--"}
                  </p>
                </div>
                <div className="clockOut-time">
                  <p className="clock-label">Clock out</p>
                  <p className="clock-time-display">
                    {clockOutTime
                      ? clockOutTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--:--:--"}
                  </p>
                </div>
              </div>
              <button
                className={`attendance-btn ${
                  isClockedIn
                    ? "bg-red-100 hover:bg-red-200 text-red-600 font-semibold"
                    : "bg-green-600 hover:bg-green-700 text-white font-semibold"
                }`}
                onClick={handleClockAction}
              >
                {isClockedIn ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                )}
                {isClockedIn ? " Clock Out" : "Clock In"}
              </button>
            </div>
            <div className="attendance-history">
              <h2 className="text-lg font-semibold opacity-80 mb-2">
                Attendance History
              </h2>
              <div className="table-history-container">
                <table className="table-history">
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>DAY</th>
                      <th>CLOCK IN</th>
                      <th>CLOCK OUT</th>
                      <th>TOTAL HOURS</th>
                      <th>OT</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{clockInDate}</td>
                      <td>{clockInDay}</td>
                      <td>
                        {clockInTime
                          ? clockInTime.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "--:--:--"}
                      </td>
                      <td>
                        {clockOutTime
                          ? clockOutTime.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "--:--:--"}
                      </td>
                      <td>{TotalHours() || "--"}</td>
                      <td>
                        {CalculateOvertime(clockInTime, clockOutTime) || "--"}
                      </td>
                      <td>--:--:--</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
