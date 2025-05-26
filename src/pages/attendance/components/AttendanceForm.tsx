import { useEffect, useState } from "react";
import "../css/AttendanceForm.css";
import { getShiftRotations } from "../SupabaseFunction/AttendanceDatabase";
import { getAttendanceHistory } from "../SupabaseFunction/AttendanceHistory";
import { insertClockIn } from "../SupabaseFunction/InsertClockIn";
import { insertClockOut } from "../SupabaseFunction/InsertClockOut";
import { getCurrentLocation } from "./CurrentLocation";

import {
  validUserClockIn,
  userOnLeave,
} from "../SupabaseFunction/ValidateClockIn";
import { validUserClockOut } from "../SupabaseFunction/ValidateClockOut";
import { getClockInOut } from "../SupabaseFunction/RetrieveClockInOut";

export default function AttendanceForm() {
  const [time, setTime] = useState<Date>(new Date());
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string | null>("")
  const [employeeName] = useState<string>(
    localStorage.getItem("employeeName")!
  );
  const [employeeScheduleID] = useState<number>(
    parseInt(localStorage.getItem("employeeScheduleID")!, 10)
  );
  const [shiftStart, setShiftStart] = useState<number>(0);
  const [shiftEnd, setshiftEnd] = useState<number>(0);
  const [allowedBreak, setshiftBreak] = useState<number>(0);
  const [clockInLeaveError, setClockInLeaveError] = useState<boolean>(false);
  const [isAlreadyClockOut, setIsAlreadyClockOut] = useState<boolean>(false);

  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);

  // Clock ni siya
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const displayUserInfo = async () => {
    const shiftTime = await getShiftRotations(employeeName);
    const attendance = await getAttendanceHistory(employeeScheduleID);
    console.log(attendance);
    attendance.sort((a: any, b: any) => {
      const dateA = new Date(`${a.attendancedate}T${a.timein || "00:00:00"}`);
      const dateB = new Date(`${b.attendancedate}T${b.timein || "00:00:00"}`);
      return dateB.getTime() - dateA.getTime();
    });

    setAttendanceHistory(attendance);

    setShiftStart(shiftTime[0].starttime);
    setshiftEnd(shiftTime[0].endtime);
    setshiftBreak(shiftTime[0].breakminutes);
  };

  const setClockInOut = async () => {
    const now = new Date();
    const date = new Date(now.toISOString().split("T")[0]);

    const resultClockInOut = await getClockInOut(date, employeeScheduleID);

    if (resultClockInOut.length === 1) {
      const rec = resultClockInOut[0];

      if (rec.time_in) {
        const [h, m, s] = rec.time_in.split(":").map(Number);
        const inDate = new Date(); // uses today’s date
        inDate.setHours(h, m, s, 0);
        setClockInTime(inDate);
        setIsClockedIn(true);
      }

      if (rec.time_out) {
        const [h2, m2, s2] = rec.time_out.split(":").map(Number);
        const outDate = new Date();
        outDate.setHours(h2, m2, s2, 0);
        setClockOutTime(outDate);
        setIsClockedIn(false);
      }
    }
  };

  useEffect(() => {
    setClockInOut();
    displayUserInfo();
  }, []);


  const handleCurrentLoc = async () =>{
    const location = await getCurrentLocation()
    setCurrentLocation(location)
  }

  useEffect(() => {
    handleCurrentLoc()
  }, [])

  // Formatted time display
  const formattedDate = time.toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleClockAction = async () => {
    const now = new Date();
    const date = new Date(now.toISOString().split("T")[0]);
    const time = now.toTimeString().split(" ")[0];

    const validatedUserClockIn = await validUserClockIn(
      date,
      employeeScheduleID
    );

    if (validatedUserClockIn === 1) {
      const validatedUserOnLeave = await userOnLeave(date, employeeScheduleID);

      if (validatedUserOnLeave) {
        setClockInLeaveError(true);
      } else {
        const location = await getCurrentLocation();
        await insertClockIn(employeeScheduleID, date, time, location);
        setClockInOut();
        displayUserInfo();
      }
    } else {
      const validClockOut = await validUserClockOut(date, employeeScheduleID);

      if (validClockOut) {
        setIsAlreadyClockOut(true);
      } else {
        const location = await getCurrentLocation();
        await insertClockOut(date, employeeScheduleID, time, location);
        setClockInOut();
        displayUserInfo();
      }
    }
  };

  return (
    <div className="main-container">
      {clockInLeaveError && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          role="alert"
        >
          <div className="bg-red-50 w-80 p-6 rounded-xl shadow-lg border-2 border-red-500">
            {/* Message */}
            <h1 className="text-red-700 mb-6 text-sm text-center">
              You have pending or approved leave today.
              <br />
              Cancel your leave before clocking in.
            </h1>

            {/* OK button */}
            <div className="flex justify-center">
              <button
                onClick={() => setClockInLeaveError(false)}
                className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {isAlreadyClockOut && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          role="alert"
        >
          <div className="bg-white w-80 p-6 rounded-xl shadow-lg border border-red-400">
            <h2 className="text-red-600 font-semibold mb-4 text-center">
              You’ve already clocked out for today.
            </h2>
            <p className="text-gray-700 mb-6 text-center">
              Please try again tomorrow.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setIsAlreadyClockOut(false)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="right-area">
        {/* Main content */}
        <main className="main-area bg-gray-200">
          <div className="flex flex-row justify-between w-full items-center mb-4 md:mb-7">
            <h1 className="font-semibold text-xl md:font-bold md:text-2xl">
              Attendance
            </h1>
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
