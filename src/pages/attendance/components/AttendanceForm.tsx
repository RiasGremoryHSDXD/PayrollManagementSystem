import { useEffect, useState } from "react";
import "../css/AttendanceForm.css";
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../../../auth/AuthContext";
import { employee_details } from '../../Leaves/EmployeeDetail/EmployeeDetails'

export default function AttendanceForm() {
  const [time, setTime] = useState<Date>(new Date());
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
  const [employeeName, setEmployeeName] = useState<string>("John Doe");

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
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  }

  const handleClockAction = () => {
    const now = new Date();
    if (isClockedIn) {
      // Clocking out
      setClockOutTime(now);
    } else {
      // Clocking in
      setClockInTime(now);
      setClockOutTime(null);
    }
    setIsClockedIn(!isClockedIn);
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

  {
    /*Total hours in format ( z) */
  }
  const TotalHours = () => {
    if (!clockInTime || !clockOutTime) return "--:--:--";

    const diffInMs = Math.max(
      0,
      clockOutTime.getTime() - clockInTime.getTime()
    );
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    return diffInHours <= 0 ? "1 min" : `${diffInMins} min`;
  };

  {
    /*Total hours in format ( 8 hrs 30 mins) */
  }

  return (
    <div className="main-container">
      {/* Navigation and Aside Content */}
      <aside>
        <h1 className="heading">EmployeeHub</h1>
        <nav>
          <button
            className="btn bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
            onClick={() => navigate("/overview")}
          >
            Overview
          </button>

          <button
            className="btn bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
            onClick={() => navigate("/attendance")}
          >
            Attendance
          </button>

          <button 
            className="btn bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
            onClick={() => navigate("/payroll")}
          >
            Payroll
          </button>

          <button
            className="btn bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
            onClick={() => navigate("/leave-request")}
          >
            Leave Request
          </button>
          <button className="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500">
            Log Out
          </button>
        </nav>
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
          <h1>Attendance</h1>
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
