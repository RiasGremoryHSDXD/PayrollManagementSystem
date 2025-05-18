import { useEffect, useState } from "react";
import "../css/AttendanceForm.css";
import { useAuth } from "../../../auth/AuthContext";
import { employee_details } from "../../Leaves/EmployeeDetail/EmployeeDetails";
import { getShiftRotations } from "../components/AttedanceDatabase";
import { getAttendanceHistory } from "./AttendanceHistory";
import { insertClockIn } from "./InsertClockIn";
import { updateClockOut } from "./InsertClockOut";

export default function AttendanceForm() {
  const [time, setTime] = useState<Date>(new Date());
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
  const [employeeScheduleID, setEmployeeScheduleID] = useState<number>(0);
  const [shiftStart, setShiftStart] = useState<number>(0);
  const [shiftEnd, setshiftEnd] = useState<number>(0);
  const [allowedBreak, setshiftBreak] = useState<number>(0);
  const [attendancedate, setAttendancedate] = useState<string>("");
  const [timein, setTimeIn] = useState<number>(0);
  const [timeout, setTimeOut] = useState<number>(0);
  const [overtime, setOverTime] = useState<number>(0);
  const [shiftDate, setShiftDate] = useState<Date>()

  const { userEmail, userPassword } = useAuth();

  // Clock ni siya
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const displayUserInfo = async () => {
    const result = await employee_details(userEmail, userPassword);
    setEmployeeScheduleID(result[0].employeescheduled);

    const shiftTime = await getShiftRotations(result[0].employeename);
    const attendance = await getAttendanceHistory(result[0].employeescheduled);

    const formattedAttendanceDate = new Date(
      attendance[0].attendancedate
    ).toLocaleDateString("en-PH", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    console.log(attendance);
    console.log(result);
    console.log("employeeScheduleID", employeeScheduleID);

    setAttendancedate(formattedAttendanceDate);
    setTimeIn(attendance[0].timein);
    setTimeOut(attendance[0].timeout);
    setOverTime(attendance[0].ot);
    setShiftDate(shiftTime[0].shiftdate);
    setShiftStart(shiftTime[0].starttime);
    setshiftEnd(shiftTime[0].endtime);
    setshiftBreak(shiftTime[0].breakminutes);

    console.log("Employee Name", result);
  };

  useEffect(() => {
    displayUserInfo();

    const intervalId = setInterval(() => {
      displayUserInfo();
    }, 2_000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Formatted time display
  const formattedDate = time.toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // CLock in Day
  const clockInDay = time.toLocaleDateString("en-PH", {
    weekday: "short",
  });

  const TotalHours = () => {
    if (!clockInTime || !clockOutTime) return "--:--:--";

    const start = new Date(clockInTime);
    start.setSeconds(0, 0);

    const end = new Date(clockOutTime);
    end.setSeconds(0, 0);

    const diffInMs = end.getTime() - start.getTime();
    const totalMinutes = Math.round(diffInMs / (1000 * 60));

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours} hrs ${minutes} mins`;
  };

  const CalculateOvertime = (
    clockInTime: Date | null,
    clockOutTime: Date | null,
    shiftStartTime: number,
    shiftEndTime: number
  ): number => {
    if (!clockInTime || !clockOutTime) return 0;

    const endHours = Math.floor(shiftEndTime / 100);
    const endMins = shiftEndTime % 100;

    const shiftEndDate = new Date(clockInTime);
    shiftEndDate.setHours(endHours, endMins, 0, 0);

    if (clockOutTime <= shiftEndDate) {
      return 0;
    }

    const overtimeMs = clockOutTime.getTime() - shiftEndDate.getTime();
    const overtimeMinutes = Math.floor(overtimeMs / (1000 * 60));
    return overtimeMinutes;
  };

  const handleClockAction = async () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().split(" ")[0];

    try {
      const result = await employee_details(userEmail, userPassword);
      const employeeScheduleID = result[0].employeescheduled;

      if (!isClockedIn) {
        const success = await insertClockIn(employeeScheduleID, date, time);
        if (!success) {
          console.error("Clock-in failed. Not inserted.");
        }
        setClockInTime(now);
        setClockOutTime(null);
        setIsClockedIn(true);
      } else {
        const overtimeMinutes = CalculateOvertime(
          clockInTime,
          now, // current time as clockOutTime
          shiftStart,
          shiftEnd
        );

        await updateClockOut(employeeScheduleID, date, time, overtimeMinutes);
        setClockOutTime(now);
        setIsClockedIn(false);
      }

      await displayUserInfo();
    } catch (error) {
      console.error("Clock In/Out failed:", error);
    }
  };

  return (
    <div className="main-container">
      <div className="right-area">
        {/* Main content */}
        <main className="main-area">
          <div className="flex flex-row justify-between w-full items-center mb-7">
            <h1 className="font-bold text-2xl">Attendance</h1>
            <p>Shift Start: {shiftStart}</p>
            <p>Allowed Break: {allowedBreak}mins</p>
            <p>Shift End: {shiftEnd}</p>
            <p>Employee Sche ID {employeeScheduleID}</p>
          </div>
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
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                      <td>{attendancedate}</td>
                      <td>{clockInDay}</td>
                      <td>{timein}</td>
                      <td>{timeout}</td>
                      <td>{TotalHours() || "--"}</td>
                      <td>{overtime}</td>
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
