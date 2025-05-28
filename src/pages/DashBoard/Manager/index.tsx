import AsideNavProp, { View } from '../../DashBoard/Manager/components/NavigationBar'
import DashBoardHeader from '../../DashBoard/Manager/components/DashBoardHeader';
import ApproveTimeOff from '../../ApproveTimeOff/index'
import ApproveTimeSheet from '../../ApproveTimeSheet/index'
import { useState } from "react";

export default function index() {
  const [activeView, setActiveView] = useState<View>("approveTimeOff");

  const renderContent = () => {
    switch (activeView) {
      case "approveTimeOff":
        return <ApproveTimeOff />;
      case "approveTimeSheet":
        return <ApproveTimeSheet />;
      default:
        return null;
    }
  };

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
