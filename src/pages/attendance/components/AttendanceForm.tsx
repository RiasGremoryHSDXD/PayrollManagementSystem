import { useEffect, useState } from "react";
import "../css/AttendanceForm.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import { employee_details } from "../../Leaves/EmployeeDetail/EmployeeDetails";
import supabase from "../../../config/SupabaseClient";

export default function AttendanceForm() {
  const [time, setTime] = useState<Date>(new Date());
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [employeeScheduleID, setEmployeeScheduleID] = useState<number>(0);
  const { userEmail, userPassword } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getEmployeeName();
  }, []);

  const getEmployeeName = async () => {
    try {
      const result = await employee_details(userEmail, userPassword);
      if (result && result.length > 0) {
        setEmployeeName(result[0].employeename);
        setEmployeeScheduleID(result[0].employeescheduled);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

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
      {/* Navigation and Aside Content */}
      <aside>
        <h1 className="heading">EmployeeHub</h1>
        <nav>
          <div>
            <button onClick={() => navigate("/overview")}>
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
                  d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                />
              </svg>
              Overview
            </button>

            <button onClick={() => navigate("/attendance")}>
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
              Attendance
            </button>

            <button onClick={() => navigate("/payroll")}>
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
                  d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                />
              </svg>
              Payroll
            </button>

            <button onClick={() => navigate("/leave-request")}>
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
                  d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
                />
              </svg>
              Leave Request
            </button>
          </div>
        </nav>
        <div className="logOut-btn">
          <button>
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
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            Log Out
          </button>
        </div>
      </aside>

      <div className="right-area">
        <header className="header-area">
          <div className="dashboard">
            <h1>Dashboard</h1>
            <p>{formattedDate}</p>
          </div>
          <div className="profile">
            <img
              src="public/person_icon.svg"
              alt="person_icon"
              className="w-[20px] h-[20px] m-5 hover:to-blue-700"
            />
            <div className="profile-name">
              <p className=" font-medium text-gray-800 text-sm">
                {employeeName}
              </p>

              <p className="text-gray-600 text-sm">Software Engineer</p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="main-area">
          <div className="flex justify-between px-4 items-center">
            <h1>Attendance</h1>
            <p>Employee Sche ID: {employeeScheduleID}</p>
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
