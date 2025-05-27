import AsideNavProp, { View } from "../../../pages/DashBoard/Employee/components/NavigationBar";
import DashBoardHeader from "../../../pages/DashBoard/Employee/components/DashBoardHeader";
import AttendanceForm from "../../attendance/components/AttendanceForm";
import PayrollPage from "../../Payroll/components/payroll";
import LeaveForm from "../../Leaves/index";
import { useEffect, useState } from "react";

export default function index() {
  const [activeView, setActiveView] = useState<View>("attendance");
  const [isPositionMananger, setIsPositionMananger] = useState<boolean>(true);

  useEffect(() => {
    const user_position = localStorage.getItem("employeePosition");

    if (user_position !== "Manager") {
      setIsPositionMananger(false);
    }
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case "attendance":
        return <AttendanceForm />;
      case "payroll":
        return <PayrollPage />;
      case "leave":
        return <LeaveForm />;
      default:
        return null;
    }
  };

  if (isPositionMananger) {
    return (
      <h1 className="flex w-[100vw] h-[100vh] justify-center items-center text-red-600">
        This link is for employees only—managers cannot access this page.
      </h1>
    );

    // localStorage.clear()
    // alert('Refresh so that i it will go to Log in form')
    // navigate('/')
  }

  return (
    <div className="flex ">
      <AsideNavProp activeView={activeView} onChangeView={setActiveView} />
      <div className="felx h-screen w-full xl:overflow-hidden overflow-auto">
        <DashBoardHeader activeView={activeView} onChangeView={setActiveView} />
        {renderContent()}
      </div>
    </div>
  );
}
