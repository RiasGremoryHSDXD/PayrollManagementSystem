// src/pages/ApproveTimeOff.tsx
import { useEffect, useState } from "react";
import { time_off_approval } from "./SupabaseFunction/TimeOfRequest";
import ApprovedTimeOff from "./components/ApprovedTimeOff";

export type LeaveRequest = {
  first_name: string;
  last_name: string;
  start_date: string; // ISO date
  end_date: string; // ISO date
  day_requested: string; // ISO timestamp
  leave_types: string;
  leave_status: string;
  employee_schedule_id: number; // ← keep this
  leave_id: number; // ← and this
  reason: string;
};

export default function ApproveTimeOff() {
  const [requests, setRequests] = useState<LeaveRequest[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clickRow, setClickRow] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [employeeScheduleID, setEmployeeScheduleID] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [requestedDate, setRequestedDate] = useState<string>("");
  const [leaveTypes, setLeaveTypes] = useState<string>("");
  const [leaveStatus, setLeaveStatus] = useState<string>("");
  const [leaveID, setLeaveID] = useState<number>(0);
  const [managerID] = useState<number>(
    parseInt(localStorage.getItem("employeeScheduleID")!, 10)
  );
  const [reason, SetReason] = useState<string>("");

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    let isMounted = true; // to avoid setting state on unmounted component
    const fetchData = async () => {
      try {
        const data = await time_off_approval(managerID);
        if (!data) throw new Error("No data returned");
        const simplified = (data as any[]).map((r) => ({
          first_name: r.first_name,
          last_name: r.last_name,
          start_date: r.start_date,
          end_date: r.end_date,
          day_requested: r.day_requested,
          leave_types: r.leave_types,
          leave_status: r.leave_status,
          employee_schedule_id: r.employee_schedule_id,
          leave_id: r.leave_id,
          reason: r.reason,
        }));
        if (isMounted) setRequests(simplified);
        console.log(data);
      } catch (err: any) {
        console.error(err);
        if (isMounted) setError(err.message || "Failed to load leave requests");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();

    const intervalId = setInterval(fetchData, 2000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  if (loading) return <div className="p-4 text-gray-600">Loading…</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!requests || requests.length === 0)
    return <div className="p-4 text-gray-600">No leave requests found.</div>;

  // compute inclusive days
  const getDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  // new: when a row is clicked, log its full data
  const handleRowClick = (r: LeaveRequest) => {
    setFirstName(r.first_name);
    setLastName(r.last_name);
    setEmployeeScheduleID(r.employee_schedule_id);
    setStartDate(r.start_date);
    setEndDate(r.end_date);
    setRequestedDate(r.day_requested);
    setLeaveTypes(r.leave_types);
    setLeaveStatus(r.leave_status);
    setLeaveID(r.leave_id);
    SetReason(r.reason);
    setClickRow(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-base lg:text-xl xl:text-2xl font-semibold mb-4">
        Approve Time Off
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 hidden md:table-cell text-left text-sm font-medium text-gray-700">
                Employee
              </th>
              <th className="px-4 py-2 hidden md:table-cell text-left text-sm font-medium text-gray-700">
                Date Range
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Days
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Requested On
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Type
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(r)}
              >
                <td className="px-4 py-2 hidden md:table-cell text-sm lg:text-base text-gray-800">
                  {r.first_name} {r.last_name}
                </td>
                <td className="px-4 py-2 hidden md:table-cell text-sm lg:text-base text-gray-800">
                  {dateFormatter.format(new Date(r.start_date))} –{" "}
                  {dateFormatter.format(new Date(r.end_date))}
                </td>
                <td className="px-4 py-2 text-sm lg:text-base text-gray-800">
                  {getDays(r.start_date, r.end_date)}
                </td>
                <td className="px-4 py-2 text-sm lg:text-base text-gray-800">
                  {dateFormatter.format(new Date(r.day_requested))}
                </td>
                <td className="px-4 py-2 text-sm lg:text-base text-gray-800">
                  {r.leave_types}
                </td>
                <td className="px-4 py-2 text-sm">
                  {r.leave_status === "Approved" ? (
                    <span className="px-2 py-1 text-green-800 bg-green-100 rounded-full lg:text-sm text-xs">
                      Approved
                    </span>
                  ) : r.leave_status === "Pending" ? (
                    <span className="px-2 py-1 text-yellow-800 bg-yellow-100 rounded-full lg:text-sm text-xs">
                      Pending
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-red-800 bg-red-100 rounded-full lg:text-sm text-xs">
                      {r.leave_status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {clickRow && (
        <ApprovedTimeOff
          currentManagerID={localStorage.getItem("employeeID")}
          first_name={firstName}
          last_name={lastName}
          start_date={startDate}
          end_date={endDate}
          day_requested={requestedDate}
          leave_types={leaveTypes}
          leave_status={leaveStatus}
          employee_schedule_id={employeeScheduleID}
          leave_id={leaveID}
          reason={reason}
          onApprove={() => setClickRow(false)}
          onReject={() => setClickRow(false)}
          onCancel={() => setClickRow(false)}
        />
      )}
    </div>
  );
}
