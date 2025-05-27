import { useEffect, useState } from "react";
import { getEmployeeDetailsForPayroll } from "../SupabaseFunction/RetieveEmployeeInfo";
import EmployeeInfo from "./EmployeeInfo";
import { X } from "lucide-react";

interface EmployeeDetails {
  employee_id: number;
  first_name: string;
  last_name: string;
  position_title: string;
  department_name: string;
  manager_id: number;
  shift_start_time: string;
  shift_end_time: string;
  employee_schedule_id: number;
}

export default function ListOfEmployee() {
  const [managerID] = useState<number>(
    parseInt(localStorage.getItem("employeeScheduleID")!, 10)
  );
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetails | null>(null);

  const getEmployeeDetails = async () => {
    const data = await getEmployeeDetailsForPayroll(managerID);
    if (data) setEmployeeDetails(data);
  };

  useEffect(() => {
    getEmployeeDetails();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4">
        List of Employees
      </h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm md:text-lg font-medium text-gray-700">
              Name
            </th>
            <th className="px-4 py-2 text-left text-sm md:text-lg font-medium text-gray-700">
              Position
            </th>
            <th className="px-4 py-2 text-left text-sm md:text-lg font-medium text-gray-700">
              Department
            </th>
          </tr>
        </thead>
        <tbody>
          {employeeDetails.map((emp) => (
            <tr
              key={emp.employee_id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedEmployee(emp)}
            >
              <td className="px-4 py-2 text-sm lg:text-base text-gray-800">
                {emp.first_name} {emp.last_name}
              </td>
              <td className="px-4 py-2 text-sm lg:text-base text-gray-800">
                {emp.position_title}
              </td>
              <td className="px-4 py-2 text-sm lg:text-base text-gray-800">
                {emp.department_name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEmployee && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-300"
          onClick={() => setSelectedEmployee(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-lg overflow-hidden relative mx-4 sm:mx-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEmployee(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
            <EmployeeInfo {...selectedEmployee} />
          </div>
        </div>
      )}
    </div>
  );
}
