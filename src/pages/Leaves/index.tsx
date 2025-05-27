import "./css/Leave.css";
import NewRequest from "./components/NewRequest";
import Leave from "./components/LeaveCard";
import RequestHistory from "./components/RequestHistory";
import { useAuth } from "../../auth/AuthContext";
import { employee_details } from "./SupabaseFunction/EmployeeDetails";
import { get_used_leave } from "./SupabaseFunction/GetUsedLeave";
import { get_max_leave_day } from "./SupabaseFunction/GetTotalLeave";
import { useEffect, useState } from "react";

export default function index() {
  const [vacationUsedLeave, setVactionUseLeave] = useState<number>(0);
  const [vacationTotalLeave, setVacationTotalLeave] = useState<number>(0);
  const [sickUsedLeave, setSickLeave] = useState<number>(0);
  const [sickTotalLeave, setSickTotalLeave] = useState<number>(0);
  const [personalUsedLeave, setPersonalLeave] = useState<number>(0);
  const [personalTotalLeave, setPersonalTotalLeave] = useState<number>(0);
  const [employeeScheID, setEmployeeID] = useState<number | null>(null);
  const { userEmail, userPassword } = useAuth();

  useEffect(() => {
    console.log(localStorage.getItem("username"));
    console.log(localStorage.getItem("password"));
  });

  useEffect(() => {
    employee_details(userEmail, userPassword)
      .then((result) => setEmployeeID(result[0].employeescheduled))
      .catch(console.error);
  }, [userEmail, userPassword]);

  useEffect(() => {
    if (employeeScheID === null) return;

    const fetchLeaves = () => {
      get_used_leave(employeeScheID, "Vacation")
        .then((result) => {
          if (Array.isArray(result) && result.length > 0) {
            setVactionUseLeave(result[0].total_leave);
          }
        })
        .catch((err) => {
          console.error("Error fetching vacation leaves", err);
        });

      get_used_leave(employeeScheID, "Sick Leave")
        .then((result) => {
          if (Array.isArray(result) && result.length > 0) {
            setSickLeave(result[0].total_leave);
          }
        })
        .catch((err) => {
          console.error("Error fetching sick leaves", err);
        });

      get_used_leave(employeeScheID, "Personal Leave")
        .then((result) => {
          if (Array.isArray(result) && result.length > 0) {
            setPersonalLeave(result[0].total_leave);
          }
        })
        .catch((err) => {
          console.error("Error fetching personal leaves", err);
        });
    };

    fetchLeaves();
    const intervalID = setInterval(fetchLeaves, 2000);
    return () => clearInterval(intervalID);
  }, [employeeScheID]);

  useEffect(() => {
    if (employeeScheID === null) return;

    const fetchTotalLeaves = () => {
      get_max_leave_day("Vacation").then((result) =>
        setVacationTotalLeave(result)
      );
      get_max_leave_day("Sick Leave").then((result) =>
        setSickTotalLeave(result)
      );
      get_max_leave_day("Personal Leave").then((result) =>
        setPersonalTotalLeave(result)
      );
    };

    fetchTotalLeaves();

    const intervalID = setInterval(fetchTotalLeaves, 2000);
    return () => clearInterval(intervalID);
  }, [employeeScheID]);

  return (
    <div className="flex flex-col gap-4 lg:gap-12 xl:gap-20 flex-1 xl:px-[120px] bg-gray-100">
      <NewRequest />

      <div className="flex flex-col md:px-5 items-center lg:justify-center lg:flex-row gap-4 w-full justify-center">
        <Leave
          leaveType="Vacation"
          used={vacationUsedLeave}
          total={vacationTotalLeave}
        />
        <Leave leaveType="Sick" used={sickUsedLeave} total={sickTotalLeave} />
        <Leave
          leaveType="Personal"
          used={personalUsedLeave}
          total={personalTotalLeave}
        />
      </div>

      <RequestHistory />
    </div>
  );
}
