type LeaveCardProps = {
  leaveType: string;
  used: number;
  total: number;
};

export default function LeaveCard({ leaveType, used, total }: LeaveCardProps) {
  const available = total - used;

  // Compute percent, but never below 0% or above 100%, and avoid division by zero
  const percentAvailable = total > 0
    ? Math.max(0, Math.min((available / total) * 100, 100))
    : 0;

  return (
    <div className="bg-white shadow rounded-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm min-w-0">
      {/* Header */}
      <h2 className="text-lg sm:text-xl font-semibold mb-4">{leaveType}</h2>

      {/* Available label & value */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-500 text-sm sm:text-base">Available</span>
        <span className="text-blue-600 font-bold text-sm sm:text-base">
          {available >= 0 ? available : 0} days
        </span>
      </div>

      {/* Progress bar container */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${percentAvailable}%` }}
        />
      </div>

      {/* Footer stats */}
      <div className="flex justify-between text-xs sm:text-sm text-gray-500">
        <span>Used: {used} days</span>
        <span>Total: {total} days</span>
      </div>
    </div>
  );
}
