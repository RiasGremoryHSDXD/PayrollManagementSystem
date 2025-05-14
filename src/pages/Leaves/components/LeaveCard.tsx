
type LeaveCardProps = {
    leaveType: string;
    used: number;
    total: number;
}

export default function LeaveCard({leaveType, used, total}: LeaveCardProps) {
  const available = total - used;
  const percentAvailable = (available / total) * 100;

  return (
    <div className="bg-white shadow rounded-xl p-6 w-[300px] max-w-sm">
      {/* Header */}
      <h2 className="text-xl font-semibold mb-4">{leaveType}</h2>

      {/* Available label & value */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-500">Available</span>
        <span className="text-blue-600 font-bold">{available} days</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${percentAvailable}%` }}
        />
      </div>

      {/* Footer stats */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>Used: {used} days</span>
        <span>Total: {total} days</span>
      </div>
    </div>
  );
}
