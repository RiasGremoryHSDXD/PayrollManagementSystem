import "../css/NavigationBar.css";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Clock, FileCheck, LogOut as LogoutIcon } from "lucide-react"; // Lucide-React icons are inline SVG React components :contentReference[oaicite:0]{index=0}

export type View =
  | "approveTimeOff"
  | "approveTimeSheet"
  | "ResolveDiscrepancies";

interface AsideNavProp {
  activeView: View;
  onChangeView: (view: View) => void;
}

const AsideNav: FC<AsideNavProp> = ({ activeView, onChangeView }) => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside>
      <div className="heading-container">
        <h1 className="text-[clamp(0.875rem,1vw,1.25rem)] font-bold text-purple-600">
          Manager Hub
        </h1>
      </div>

      <div className="navigation">
        <nav>
          <button
            className={activeView === "approveTimeOff" ? "active" : ""}
            onClick={() => onChangeView("approveTimeOff")}
          >
            <Layers className="w-5 h-5 mr-3" />
            Time Off
          </button>
          <button
            className={activeView === "approveTimeSheet" ? "active" : ""}
            onClick={() => onChangeView("approveTimeSheet")}
          >
            <Clock className="w-5 h-5 mr-3" />
            Time Sheet
          </button>
          <button
            className={activeView === "ResolveDiscrepancies" ? "active" : ""}
            onClick={() => onChangeView("ResolveDiscrepancies")}
          >
            <FileCheck className="w-5 h-5 mr-3" />
            Discrepancy
          </button>
        </nav>
        <div className="logOut-btn-container">
          <button className="logOut-btn" onClick={handleLogOut}>
            <LogoutIcon className="w-5 h-5 mr-3" />
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AsideNav;
