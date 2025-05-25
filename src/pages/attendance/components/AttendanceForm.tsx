import { useEffect, useState } from "react";
import "../css/AttendanceForm.css";
import { useAuth } from "../../../auth/AuthContext";
import { employee_details } from "../../Leaves/EmployeeDetail/EmployeeDetails";
import { getShiftRotations } from "./AttendanceDatabase";
import { getAttendanceHistory } from "./AttendanceHistory";
import { insertClockIn } from "./InsertClockIn";
import { updateClockOut } from "./InsertClockOut";
import { attendanceID } from "./RetrieveAttendanceID";

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
  const [attendanceId, setAttendanceId] = useState<number | null>(null);
  const [timein, setTimeIn] = useState<number>(0);
  const [timeout, setTimeOut] = useState<number>(0);
  const [overtime, setOverTime] = useState<number>(0);
  const [shiftDate, setShiftDate] = useState<Date>();

  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const { userEmail, userPassword } = useAuth();

  // Clock ni siya
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const displayUserInfo = async () => {
    const result = await employee_details(userEmail, userPassword);
    setEmployeeScheduleID(result[0].employeescheduled);

    const attendanceIDresult = await attendanceID();
    const shiftTime = await getShiftRotations(result[0].employeename);
    const attendance = await getAttendanceHistory(result[0].employeescheduled);
    attendance.sort((a: any, b: any) => {
      const dateA = new Date(`${a.attendancedate}T${a.timein || "00:00:00"}`);
      const dateB = new Date(`${b.attendancedate}T${b.timein || "00:00:00"}`);
      return dateB.getTime() - dateA.getTime();
    });

    setAttendanceHistory(attendance);

    const formattedAttendanceDate = new Date(
      attendance[0].attendancedate
    ).toLocaleDateString("en-PH", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    setAttendanceId(attendanceIDresult);
    setAttendancedate(formattedAttendanceDate);

    const timeInStr = attendance[0].timein;
    const timeOutStr = attendance[0].timeout;

    if (timeInStr) {
      const [h, m, s] = timeInStr.split(":").map(Number);
      const clockInDate = new Date();
      clockInDate.setHours(h, m, s, 0);
      setClockInTime(clockInDate);
    } else {
      setClockInTime(null);
    }

    if (timeOutStr) {
      const [h, m, s] = timeOutStr.split(":").map(Number);
      const clockOutDate = new Date();
      clockOutDate.setHours(h, m, s, 0);
      setClockOutTime(clockOutDate);
    } else {
      setClockOutTime(null);
    }

    setIsClockedIn(!timeOutStr);

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

  const CalculateOvertime = (
    clockInTime: Date | null,
    clockOutTime: Date | null,
    shiftStartTime: number,
    shiftEndTime: number
  ): number => {
    if (
      !clockInTime ||
      !clockOutTime ||
      isNaN(shiftEndTime) ||
      isNaN(shiftStartTime)
    )
      return 0;

    // Parse shift start and end hours and minutes from HHMM format
    const startHours = Math.floor(shiftStartTime / 100);
    const startMins = shiftStartTime % 100;
    const endHours = Math.floor(shiftEndTime / 100);
    const endMins = shiftEndTime % 100;

    // Create shift start date
    let shiftStartDate = new Date(clockInTime);
    shiftStartDate.setHours(startHours, startMins, 0, 0);

    // Create shift end date initially on the same day as shiftStartDate
    let shiftEndDate = new Date(clockInTime);
    shiftEndDate.setHours(endHours, endMins, 0, 0);

    // If shift end time is before or equal to shift start, it means overnight shift: add 1 day
    if (shiftEndDate <= shiftStartDate) {
      shiftEndDate.setDate(shiftEndDate.getDate() + 1);
    }

    // Adjust clockOutTime if it's earlier than clockInTime (crosses midnight)
    let adjustedClockOut = new Date(clockOutTime);
    if (adjustedClockOut < clockInTime) {
      adjustedClockOut.setDate(adjustedClockOut.getDate() + 1);
    }

    // If clockOutTime is before or equal to shift end, no overtime
    if (adjustedClockOut <= shiftEndDate) return 0;

    // Calculate difference in minutes between clockOutTime and shiftEndDate
    const overtimeMs = adjustedClockOut.getTime() - shiftEndDate.getTime();
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
        // Only clock in: do NOT set overtime yet
        const success = await insertClockIn(employeeScheduleID, date, time);
        if (!success) {
          console.error("Clock-in failed. Not inserted.");
          return;
        }
        console.log(attendanceId);

        setClockInTime(now);
        setClockOutTime(null);
        setIsClockedIn(true);
      } else {
        const overtimeMinutes = CalculateOvertime(
          clockInTime,
          now,
          shiftStart,
          shiftEnd
        );

        if (attendanceId !== null) {
          await updateClockOut(attendanceId, date, time, overtimeMinutes);
          console.log("Clocking out with:", {
            attendanceId,
            date,
            time,
            overtimeMinutes,
          });
        } else {
          console.error("No attendance ID found for update.");
          return;
        }

        setClockOutTime(now);
        setIsClockedIn(false);
      }

      // Refresh data after update
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
                    {attendanceHistory.map((record, index) => {
                      const timeInValue = record.timein;
                      const timeOutValue = record.timeout;

                      const formattedDate = new Date(
                        record.attendancedate
                      ).toLocaleDateString("en-PH", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });

                      const dayOfWeek = new Date(
                        record.attendancedate
                      ).toLocaleDateString("en-PH", {
                        weekday: "short",
                      });

                      const totalHours = (() => {
                        if (!timeInValue || !timeOutValue) return "--:--";

                        const [inH, inM, inS] = timeInValue
                          .split(":")
                          .map(Number);
                        const [outH, outM, outS] = timeOutValue
                          .split(":")
                          .map(Number);

                        const inDate = new Date();
                        const outDate = new Date();

                        inDate.setHours(inH, inM, inS, 0);
                        outDate.setHours(outH, outM, outS, 0);

                        const diffMs = outDate.getTime() - inDate.getTime();
                        const mins = Math.round(diffMs / 60000);
                        const hours = Math.floor(mins / 60);
                        const remainingMins = mins % 60;

                        return `${hours} hrs ${remainingMins} mins`;
                      })();

                      return (
                        <tr key={index}>
                          <td>{formattedDate}</td>
                          <td>{dayOfWeek}</td>
                          <td>{timeInValue || "--:--"}</td>
                          <td>{timeOutValue || "--:--"}</td>
                          <td>{totalHours}</td>
                          <td>{record.timeout ? `${record.ot} mins` : "--"}</td>
                          <td>--</td>
                        </tr>
                      );
                    })}
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
