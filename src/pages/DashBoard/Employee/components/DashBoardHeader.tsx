import "../css/DashBoardHeader.css";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../auth/AuthContext";
import { employee_details } from "../../../Leaves/SupabaseFunction/EmployeeDetails";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";


type View = "attendance" | "payroll" | "leave";


interface DashBoardHeader {
  activeView: View;
  onChangeView: (view: View) => void;
}


export default function DashBoardHeader({
  activeView,
  onChangeView,
}: DashBoardHeader) {
  const [time] = useState(new Date());
  const [employeeName, setEmployeeName] = useState("");
  const [employeePosition, setEmployeePosition] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const { userEmail, userPassword } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    getEmployeeName();
  }, []);


  const getEmployeeName = async () => {
    try {
      const result = await employee_details(userEmail, userPassword);
      if (result && result.length > 0) {
        setEmployeeName(result[0].employeename);
        setEmployeePosition(result[0].employeeposition);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };


  const formattedDate = time.toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  const handleViewChange = (view: View) => {
    onChangeView(view);
    setShowMenu(false);
  };
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };


  return (
    <>
      <header>
        <div className="dashboard">
          <div className="dashboard-left">
            <div className="nav_toggle" onClick={() => setShowMenu(!showMenu)}>
              <i
                className={`ri-menu-line nav_burger ${
                  showMenu ? "opacity-0" : "opacity-100"
                }`}
              ></i>
              <i
                className={`ri-close-line nav_close ${
                  showMenu ? "opacity-100" : "opacity-0"
                }`}
              ></i>
            </div>
            <h1 className="text-[clamp(0.875rem,2vw,1.125rem)] font-bold hidden xl:block text-gray-700">
              Dashboard
            </h1>
            <p className="text-[clamp(0.5rem,1.5vw,1rem)] hidden xl:block text-gray-700">
              {formattedDate}
            </p>
          </div>


          <div className="dashboard-right">
            <div>
              <img src="/person_icon.svg" alt="person_icon" />
            </div>
            <div className="profile-name">
              <p className="text-[clamp(0.75rem,2vw,1rem)] font-medium text-gray-700">
                {employeeName}
              </p>
              <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-gray-500">
                {employeePosition}
              </p>
            </div>
          </div>
        </div>


        <div
          className={`absolute pt-1 left-0 mt-1 w-full bg-white rounded-md shadow-lg z-50
          transition-all duration-400 ease-out transform origin-top
          ${
            showMenu
              ? " scale-y-100 translate-y-0 visible pointer-events-auto"
              : " scale-y-95 -translate-y-2 invisible pointer-events-none"
          }`}
        >
          <div
            className={`transition-opacity duration-300 ${
              showMenu ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="dropdown-container">
              <button
                className={activeView === "attendance" ? "Active" : ""}
                onClick={() => handleViewChange("attendance")}
              >
                Attendance
              </button>
              <button
                className={activeView === "payroll" ? "Active" : ""}
                onClick={() => handleViewChange("payroll")}
              >
                Payroll
              </button>
              <button
                className={activeView === "leave" ? "Active" : ""}
                onClick={() => handleViewChange("leave")}
              >
                Leave
              </button>
              <button className="text-red-600" onClick={handleLogOut}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="relative ">
        <div
          className={`fixed inset-0 bg-white/30 backdrop-blur-xs z-40 transition-opacity duration-300 ease-in-out ${
            showMenu ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setShowMenu(false)}
        />
      </div>
    </>
  );
}