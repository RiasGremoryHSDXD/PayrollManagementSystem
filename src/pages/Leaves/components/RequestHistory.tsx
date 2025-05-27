import { useEffect, useState } from "react";
import { getLeaveHistory } from "../SupabaseFunction/RequestLeaveHistory";
import { cancelLeaveRequest } from "../SupabaseFunction/CancelLeaveRequest";
import { deleteLeaveRequest } from "../SupabaseFunction/DeleteLeaveRequest";

interface LeaveHistoryItem {
  leave_id: number;
  leave_type: string;
  startdate: string;
  enddate: string;
  requested: string;
  approveddate: string;
  status: "Approved" | "Pending" | "Rejected" | "Cancelled";
}

export default function RequestHistory() {
  const [history, setHistory] = useState<LeaveHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<LeaveHistoryItem | null>(null);
  const [employeeScheduleID] = useState<number>(
    parseInt(localStorage.getItem("employeeScheduleID")!, 10)
  );

  const fetchLeaveHistory = async () => {
    setLoading(true);
    try {
      const schedId = employeeScheduleID;
      const data = await getLeaveHistory(schedId);
      if (data) {
        setHistory(data);
      }
    } catch (err) {
      console.error("Error fetching leave history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (leave_id: number) =>
    await cancelLeaveRequest(leave_id);
  const handleDeleteRequest = async (leave_id: number) =>
    await deleteLeaveRequest(leave_id);

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

  const calculateDays = (start: string, end: string) => {
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return days;
  };

  return (
    <div className="xl:bg-white rounded-lg shadow-md overflow-x-auto p-4 md:p-10 xl:p-6">
      <h2 className="text-md sm:text-lg font-semibold mb-4">Request History</h2>

      <div
        className="bg-white overflow-y-auto"
        style={{
          maxHeight: "calc(65vh - 250px)",
        }}
      >
        <table className="min-w-full table-auto flex-1">
          <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="w-1/5 border-b top-0 sticky border-gray-300 px-3 py-4 font-normal sm:font-medium text-gray-500 text-sm  whitespace-nowrap">
                Type
              </th>
              <th className="w-1/5 border-b top-0 sticky border-gray-300 px-3 py-4 font-normal sm:font-medium text-gray-500 text-sm  whitespace-nowrap md:table-cell hidden">
                Duration
              </th>
              <th className="w-1/5 border-b top-0 sticky border-gray-300 px-3 py-4 font-normal sm:font-medium text-gray-500 text-sm  whitespace-nowrap">
                Days
              </th>
              <th className="w-1/5 border-b top-0 sticky border-gray-300 px-3 py-4 font-normal sm:font-medium text-gray-500 text-sm  whitespace-nowrap">
                Requested
              </th>
              <th className="w-1/5 border-b top-0 sticky border-gray-300 px-3 py-4 font-normal sm:font-medium text-gray-500 text-sm  whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {history.map((item, idx) => (
              <tr
                key={idx}
                className=" hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelected(item)}
              >
                <td className="border-b border-gray-300 px-3 py-4 font-normal text-gray-800 text-sm whitespace-nowrap">
                  {item.leave_type}
                </td>

                <td className="border-b border-gray-300 px-3 py-4 font-normal text-gray-800 text-sm whitespace-nowrap md:table-cell hidden ">
                  {new Date(item.startdate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  –{" "}
                  {new Date(item.enddate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="border-b border-gray-300 px-3 py-4 font-normal text-gray-800 text-sm whitespace-nowrap">
                  {calculateDays(item.startdate, item.enddate)}
                </td>
                <td className="border-b border-gray-300 px-3 py-4 font-normal text-gray-800 text-sm whitespace-nowrap">
                  {new Date(item.requested).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="border-b border-gray-300 px-3 py-4 font-normal text-gray-800 text-sm whitespace-nowrap">
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
            {!loading && history.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No leave history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6 overflow-auto">
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl sm:text-3xl"
              aria-label="Close"
            >
              &times;
            </button>

            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">
              Leave Details
            </h3>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-700">
              <div>
                <dt className="font-medium">Leave ID</dt>
                <dd>{selected.leave_id}</dd>
              </div>
              <div>
                <dt className="font-medium">Type</dt>
                <dd>{selected.leave_type}</dd>
              </div>
              <div>
                <dt className="font-medium">Start Date</dt>
                <dd>{new Date(selected.startdate).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="font-medium">End Date</dt>
                <dd>{new Date(selected.enddate).toLocaleDateString()}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-medium">Requested On</dt>
                <dd>{new Date(selected.requested).toLocaleString()}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-medium">Reviewed On</dt>
                <dd>
                  {selected.approveddate
                    ? new Date(selected.approveddate).toLocaleString()
                    : "Not reviewed yet"}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Status</dt>
                <dd>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selected.status
                    )}`}
                  >
                    {selected.status}
                  </span>
                </dd>
              </div>
            </dl>

            {/* Actions */}
            {(selected.status === "Pending" ||
              selected.status === "Cancelled") && (
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                {selected.status === "Pending" && (
                  <button
                    onClick={async () => {
                      await handleCancelRequest(selected.leave_id);
                      setSelected(null);
                      await fetchLeaveHistory();
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Cancel Leave
                  </button>
                )}
                {selected.status === "Cancelled" && (
                  <button
                    onClick={async () => {
                      await handleDeleteRequest(selected.leave_id);
                      setSelected(null);
                      await fetchLeaveHistory();
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete Request
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
