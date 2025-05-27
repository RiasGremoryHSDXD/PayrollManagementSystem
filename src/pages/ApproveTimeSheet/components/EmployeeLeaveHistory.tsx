import { useEffect, useState } from "react";
import { getLeaveHistory } from "../SupabaseFunction/RequestLeaveHistory"


interface EmployeeID{
    employee_id: number
}

interface LeaveHistoryItem {
  leave_id: number;
  leave_type: string;
  startdate: string;
  enddate: string;
  requested: string;
  approveddate: string;
  status: "Approved" | "Pending" | "Rejected" | "Cancelled";
}

export default function EmployeeLeaveHistory({employee_id} : EmployeeID) {
    const [history, setHistory] = useState<LeaveHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    
    const fetchLeaveHistory = async () => {
    setLoading(true);
    try {
        const data = await getLeaveHistory(employee_id);
        if (data) {
        setHistory(data);
        }
    } catch (err) {
        console.error("Error fetching leave history:", err);
    } finally {
        setLoading(false);
    }};

    useEffect(() => {
        fetchLeaveHistory();
        const intervalId = setInterval(fetchLeaveHistory, 2000);
        return () => clearInterval(intervalId);
    }, []);

    const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="lg:w-2/3 p-8 overflow-y-auto bg-gray-50">
      <h2 className="text-xl md:2xl lg:text-3xl font-semibold md:font-bold text-gray-800 mb-6">
        Leave History
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow">
          <thead>
            <tr className="bg-indigo-100">
              {[
                "TYPE",
                "START",
                "END",
                "REQUESTED ON",
                "APPROVED DATE",
                "STATUS",
              ].map((label) => (
                <th
                  key={label}
                  className="py-3 px-6 text-left text-xs md:text-sm font-semibold uppercase text-indigo-700 tracking-wide whitespace-nowrap"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr
                key={item.leave_id}
                className={`border-b transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-indigo-50`}
              >
                <td className="py-2 px-4 md:py-3 md:px-6 whitespace-nowrap text-sm text-gray-700">
                  {item.leave_type}
                </td>
                <td className="py-2 px-4 md:py-3 md:px-6 whitespace-nowrap text-sm text-gray-700">
                  {new Date(item.startdate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="py-2 px-4 md:py-3 md:px-6 whitespace-nowrap text-sm text-gray-700">
                  {new Date(item.enddate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="py-2 px-4 md:py-3 md:px-6 whitespace-nowrap text-sm text-gray-700">
                  {new Date(item.requested).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="py-2 px-4 md:py-3 md:px-6 whitespace-nowrap text-sm text-gray-700">
                  {item.approveddate
                    ? new Date(item.approveddate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })
                    : "--:--"}
                </td>
                <td className="py-2 px-4 md:py-3 md:px-6 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
            {!loading && history.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-6 text-center text-gray-400 italic"
                >
                  No leave records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
