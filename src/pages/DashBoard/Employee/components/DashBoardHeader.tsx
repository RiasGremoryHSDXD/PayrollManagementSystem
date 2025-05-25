import "../css/DashBoardHeader.css";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../auth/AuthContext";
import { employee_details } from "../../../Leaves/EmployeeDetail/EmployeeDetails";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

export default function DashBoardHeader() {
  const [time] = useState<Date>(new Date());
  const [employeeName, setEmployeeName] = useState<string>("");
  const [employeePosition, setEmployeePosition] = useState<string>("");

  const { userEmail, userPassword } = useAuth();

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

  return (
    <header>
      <div className="dashboard">
        <div className="dashboard-left">
          <div className="nav_toggle">
            <i className="ri-menu-line nav__burger"></i>
            <i className="ri-close-large-line nav__close"></i>
          </div>
          <div className="nav_menu"></div>
          <h1 className="text-[clamp(0.875rem,2vw,1.125rem)] hidden md:block text-gray-700">
            Dashboard
          </h1>
          <p className="text-[clamp(0.5rem,1.5vw,1rem)] hidden md:block text-gray-700">
            {formattedDate}
          </p>
        </div>

        <div className="dashboard-right">
          <div>
            <img src="public/person_icon.svg" alt="person_icon" />
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
    </header>
  );
}
