// src/components/NavigationBar.tsx
import { FC } from "react"
import { useNavigate } from "react-router-dom"
import {
  Layers,
  Clock,
  FileCheck,
  LogOut as LogoutIcon,
} from "lucide-react"  // Lucide-React icons are inline SVG React components :contentReference[oaicite:0]{index=0}

export type View = "approveTimeOff" | "approveTimeSheet" | "ResolveDiscrepancies"

interface AsideNavProp {
  activeView: View
  onChangeView: (view: View) => void
}

const AsideNav: FC<AsideNavProp> = ({ activeView, onChangeView }) => {
  const navigate = useNavigate()

  const handleLogOut = () => {
    localStorage.clear()
    navigate("/")
  }

  const buttonBase =
    "flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
  const activeBase = "bg-blue-50 text-blue-600"

  return (
    <nav className="flex flex-col h-screen w-60 border-r border-gray-200">
      {/* Brand logo at top */}
      <div className="p-4 flex justify-center">
        {/* Swap <Box> for any Lucide icon you prefer :contentReference[oaicite:1]{index=1} */}
      </div>

      <div className="flex-1 space-y-2 p-4">
        {/* Time Off */}
        <button
          className={`${buttonBase} ${
            activeView === "approveTimeOff" ? activeBase : ""
          }`}
          onClick={() => onChangeView("approveTimeOff")}
        >
          <Layers className="w-5 h-5 mr-3" />
          <span>Time Off</span>
        </button>

        {/* Time Sheet */}
        <button
          className={`${buttonBase} ${
            activeView === "approveTimeSheet" ? activeBase : ""
          }`}
          onClick={() => onChangeView("approveTimeSheet")}
        >
          <Clock className="w-5 h-5 mr-3" />
          <span>Time Sheet</span>
        </button>

        {/* Discrepancy */}
        <button
          className={`${buttonBase} ${
            activeView === "ResolveDiscrepancies" ? activeBase : ""
          }`}
          onClick={() => onChangeView("ResolveDiscrepancies")}
        >
          <FileCheck className="w-5 h-5 mr-3" />
          <span>Discrepancy</span>
        </button>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
          onClick={handleLogOut}
        >
          <LogoutIcon className="w-5 h-5 mr-3" />
          <span>Log Out</span>
        </button>
      </div>
    </nav>
  )
}

export default AsideNav
