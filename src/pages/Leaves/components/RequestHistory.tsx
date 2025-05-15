import { useAuth } from "../../../auth/AuthContext";
import { getLeaveHistory } from "../RequestHistory/RequestLeaveHistory";
import { useEffect, useState } from "react";
import { employee_details } from '../EmployeeDetail/EmployeeDetails'

interface LeaveHistoryItem {
  leave_type: string;
  startdate: string;
  enddate: string;
  requested: string;
  status: "Approved" | "Pending" | "Rejected"; // Update based on your enum
}

export default function RequestHistory() {
  const { userEmail, userPassword } = useAuth();
  const [history, setHistory] = useState<LeaveHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);



  const fetchLeaveHistory = async () => {
    setLoading(true);
    try { 
      const result = await employee_details(userEmail, userPassword)

      const data = await getLeaveHistory(result[0].employeescheduled);
      if (data) {
        setHistory(data);
      }
    } catch (error) {
      console.error("Error fetching leave history:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // fetch once immediately
    fetchLeaveHistory();

    const intervalId = setInterval(() => {
      fetchLeaveHistory();
    }, 2_000);

    return () => {
      clearInterval(intervalId);
    };
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

  const calculateDays = (start: string, end: string) => {
    const diff =
      (new Date(end).getTime() - new Date(start).getTime()) /
      (1000 * 60 * 60 * 24) +
      1;
    return Math.max(diff, 1); // At least 1 day
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Request History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Days</th>
              <th className="px-4 py-2">Requested</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600">
            {history.map((item, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">{item.leave_type}</td>
                <td className="px-4 py-2">
                  {new Date(item.startdate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(item.enddate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-2">
                  {calculateDays(item.startdate, item.enddate)}
                </td>
                <td className="px-4 py-2">
                  {new Date(item.requested).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
            {history.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No leave history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
