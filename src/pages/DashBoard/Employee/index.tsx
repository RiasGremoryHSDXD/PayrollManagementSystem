import AsideNavProp, { View } from "../componets/NavigationBar";
import DashBoardHeader from "../componets/DashBoardHeader";
import AttendanceForm from "../../attendance/components/AttendanceForm";
import PayrollPage from "../../Payroll/components/payroll";
import LeaveForm from "../../Leaves/index";
import { useState } from "react";

export default function index() {
  const [activeView, setActiveView] = useState<View>("attendance");

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return <h1>Overview Page</h1>;
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

  return (
    <div className="flex ">
      <AsideNavProp activeView={activeView} onChangeView={setActiveView} />
      <div>
        <DashBoardHeader />
        {renderContent()}
      </div>
    </div>
  );
}
