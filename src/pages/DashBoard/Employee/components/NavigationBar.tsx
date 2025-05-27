import "../css/NavigationBar.css";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
export type View = "attendance" | "payroll" | "leave";

interface AsideNavProp {
  activeView: View;
  onChangeView: (View: View) => void;
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
        <h1 className="text-[clamp(0.875rem,1vw,1.25rem)] font-bold text-blue-600 ">
          Employee Hub
        </h1>
      </div>

      <div className="navigation">
        <nav>
          <button
            className={activeView === "attendance" ? "active" : ""}
            onClick={() => onChangeView("attendance")}
          >
            <i className="ri-time-line "></i>
            Attendance
          </button>

          <button
            className={activeView === "payroll" ? "active" : ""}
            onClick={() => onChangeView("payroll")}
          >
            <i className="ri-cash-line"></i>
            Payroll
          </button>

          <button
            className={activeView === "leave" ? "active" : ""}
            onClick={() => onChangeView("leave")}
          >
            <i className="ri-calendar-2-line"></i>
            Leave Request
          </button>
        </nav>

        <div className="logOut-btn-container">
          <button className="logOut-btn" onClick={handleLogOut}>
            <i className="ri-door-open-line"></i>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AsideNav;
