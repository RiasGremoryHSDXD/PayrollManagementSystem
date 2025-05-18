import AsideNavProp, { View } from '../Manager/components/NavigationBar'
import DashBoardHeader from './components/DashBoardHeader';
import ApproveTimeOff from '../../ApproveTimeOff/index'
import ApproveTimeSheet from '../../ApproveTimeSheet/index'
import ResolveDiscrepancies from '../../ResolveDiscrepancies/index'
import { useEffect, useState } from "react";

export default function index() {
  const [activeView, setActiveView] = useState<View>("approveTimeOff");

  const renderContent = () => {
    switch (activeView) {
      case "approveTimeOff":
        return <ApproveTimeOff />;
      case "approveTimeSheet":
        return <ApproveTimeSheet />;
      case "ResolveDiscrepancies":
        return <ResolveDiscrepancies />;
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
