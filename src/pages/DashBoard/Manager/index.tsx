<<<<<<< HEAD
import AsideNavProp, { View } from '../Manager/components/NavigationBar'
import DashBoardHeader from './components/DashBoardHeader';
import ApproveTimeOff from '../../ApproveTimeOff/index'
import ApproveTimeSheet from '../../ApproveTimeSheet/index'
import ResolveDiscrepancies from '../../ResolveDiscrepancies/index'
import { useState } from "react";

=======
import AsideNavProp, { View } from "../Manager/components/NavigationBar";
import DashBoardHeader from "./components/DashBoardHeader";
import ApproveTimeOff from "../../ApproveTimeOff/index";
import ApproveTimeSheet from "../../ApproveTimeSheet/index";
import ResolveDiscrepancies from "../../ResolveDiscrepancies/index";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
>>>>>>> 656d3b5cb5d3e1dee4aa156bc02a5491294d48cd
export default function index() {
  const [activeView, setActiveView] = useState<View>("approveTimeOff");

  const navigate = useNavigate();

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
      <div className="felx h-screen w-full xl:overflow-hidden overflow-auto">
        <DashBoardHeader activeView={activeView} onChangeView={setActiveView} />
        {renderContent()}
      </div>
    </div>
  );
}
