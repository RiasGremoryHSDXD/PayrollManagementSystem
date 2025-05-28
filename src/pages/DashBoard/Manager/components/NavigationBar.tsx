import "../css/NavigationBar.css";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Clock, LogOut as LogoutIcon } from "lucide-react";


export type View =
  | "approveTimeOff"
  | "approveTimeSheet"
 


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
        <nav className="nav-manager">
          <button
            className={activeView === "approveTimeOff" ? "active" : ""}
            onClick={() => onChangeView("approveTimeOff")}
          >
            <Layers className="text-[clamp(1rem,2vw,1.5rem)]" />
            Time Off
          </button>
          <button
            className={activeView === "approveTimeSheet" ? "active" : ""}
            onClick={() => onChangeView("approveTimeSheet")}
          >
            <Clock className="text-[clamp(1rem,2vw,1.5rem)]" />
            Time Sheet
          </button>
        </nav>
        <div className="logOut-btn-container">
          <button className="logOut-btn" onClick={handleLogOut}>
            <LogoutIcon className="text-[clamp(1rem,2vw,1.5rem)]" />
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AsideNav;
