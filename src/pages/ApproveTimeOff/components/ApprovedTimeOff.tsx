import { update_employee_leave_status } from "../SupabaseFunction/UpdateLeaveRequest";

export type EmployeeDetailsProps = {
  currentManagerID: string | null;
  first_name: string;
  last_name: string;
  start_date: string; // ISO date
  end_date: string; // ISO date
  day_requested: string; // ISO timestamp
  leave_types: string;
  leave_status: string;
  employee_schedule_id: number;
  leave_id: number;
  reason: string;
  onApprove?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
};
const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export default function ApprovedTimeOff({
  currentManagerID,
  first_name,
  last_name,
  start_date,
  end_date,
  day_requested,
  leave_types,
  leave_status,
  leave_id,
  reason,
  onApprove,
  onReject,
  onCancel,
}: EmployeeDetailsProps) {
  const handleReject = async () => {
    await update_employee_leave_status(
      Number(currentManagerID),
      leave_id,
      "Rejected"
    );
    onReject?.();
  };

  const handleApprove = async () => {
    await update_employee_leave_status(
      Number(currentManagerID),
      leave_id,
      "Approved"
    );
    onApprove?.();
  };

  return (
    <div
      className="
        fixed inset-0 bg-black/30 flex items-center justify-center p-4
        z-50
      "
    >
      <div
        className="
          bg-white rounded-lg shadow-xl
          w-full max-w-md
          p-5 sm:p-6
          overflow-auto
          relative
        "
      >
        {/* Close btn */}
        <button
          onClick={() => onCancel?.()}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl sm:text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">
          Time Off Request
        </h2>

        <div className="space-y-2 text-sm sm:text-base text-gray-800">
          <p>
            <span className="font-medium">Employee:</span> {first_name}{" "}
            {last_name}
          </p>
          <p>
            <span className="font-medium">Period:</span>{" "}
            {new Date(start_date).toLocaleDateString("en-US", dateOptions)} –{" "}
            {new Date(end_date).toLocaleDateString("en-US", dateOptions)}
          </p>
          <p>
            <span className="font-medium">Requested On:</span>{" "}
            {new Date(day_requested).toLocaleString("en-US", dateOptions)}
          </p>
          <p>
            <span className="font-medium">Type:</span> {leave_types}
          </p>
          <p>
            <span className="font-medium">Reason:</span> {reason}
          </p>
          <p>
            <span className="font-medium">Status:</span> {leave_status}
          </p>
        </div>

        <div className="mt-6">
          {leave_status === "Pending" ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 transition"
              >
                Reject
              </button>

              <button
                onClick={() => onCancel?.()}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleApprove}
                className="flex-1 px-4 py-2 bg-green-100 text-green-600 font-medium rounded-lg hover:bg-green-200 transition"
              >
                Approve
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => onCancel?.()}
                className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
