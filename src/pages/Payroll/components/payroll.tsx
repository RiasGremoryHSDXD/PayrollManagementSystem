import { useState, useEffect } from "react";
import { getEmployeePayrolls } from "../SupabaseFunction/RetievePayroll";
import { 
  User, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  TrendingUp,
  CreditCard,
  Shield,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from "lucide-react";

interface PayrollRecord {
  payrollid: number;
  employeeID: number;
  payroll_approved_date: string;
  payroll_details: any;
  createdAt: string;
  updatedAt: string;
}

interface Payroll{
  payroll_id_click: number
}

export default function Payroll({payroll_id_click} : Payroll) {
  const [employeeID] = useState<number>(parseInt(localStorage.getItem('employeeID') || '0'));
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    employee_info: false,
    pay_calculations: true,
    deductions: false,
    time_attendance: false,
    leave_info: false,
    performance: false
  });

useEffect(() => {
    fetchPayrollData()
  }, [employeeID, payroll_id_click])

   // 2) Typed fetch function:
  const fetchPayrollData = async (): Promise<void> => {
    if (payroll_id_click === null) {
      setSelectedPayroll(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // data is now known to be PayrollRecord[]
      const data: PayrollRecord[] = await getEmployeePayrolls(
        employeeID,
        payroll_id_click
      )

      console.log('Fetched payrolls:', data)
      console.log('Clicked payroll_id:', payroll_id_click)

      setPayrollData(data)

      // find the matching one
      const match: PayrollRecord | undefined = data.find(
        (r: PayrollRecord) => r.payrollid === payroll_id_click
      )

      if (match) {
        console.log('Found matching payroll:', match)
        setSelectedPayroll(match)
      } else {
        console.warn('No payroll with id', payroll_id_click)
        setSelectedPayroll(null)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to fetch payroll data')
      setSelectedPayroll(null)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(num || 0);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading payroll data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!payrollData.length) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No payroll records found</p>
        </div>
      </div>
    );
  }

  const SectionHeader = ({ title, icon: Icon, section, isLast = false }: any) => (
    <button
      onClick={() => toggleSection(section)}
      className={`w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors ${
        isLast ? 'rounded-b-lg' : ''
      } ${section === 'employee_info' ? 'rounded-t-lg' : ''}`}
    >
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4 text-blue-600" />
        <span className="font-medium text-gray-900 text-sm">{title}</span>
      </div>
      {expandedSections[section] ? 
        <ChevronUp className="h-4 w-4 text-gray-400" /> : 
        <ChevronDown className="h-4 w-4 text-gray-400" />
      }
    </button>
  );

  const details = selectedPayroll?.payroll_details;

  return (
    <div className="p-6 max-h-screen overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Payroll Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Payroll Details</h2>
            <p className="text-sm text-gray-500">
              {details?.employee_info?.employeeName} - {details?.employee_info?.position}
            </p>
          </div>
        </div>

        {selectedPayroll && (
          <>
            {/* Summary Cards - Compact Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-xs">Gross Pay</p>
                    <p className="text-lg font-bold">
                      {details?.formatted_amounts?.gross_pay || formatCurrency(details?.pay_calculations?.gross_pay)}
                    </p>
                  </div>
                  <DollarSign className="h-6 w-6 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs">Net Pay</p>
                    <p className="text-lg font-bold">
                      {details?.formatted_amounts?.net_pay || formatCurrency(details?.pay_calculations?.net_pay)}
                    </p>
                  </div>
                  <CreditCard className="h-6 w-6 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs">Total Hours</p>
                    <p className="text-lg font-bold">
                      {(details?.time_attendance?.regular_hours + details?.time_attendance?.overtime_hours)?.toFixed(1) || '0.0'}
                    </p>
                  </div>
                  <Clock className="h-6 w-6 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-xs">Deductions</p>
                    <p className="text-lg font-bold">
                      {details?.formatted_amounts?.total_deductions || formatCurrency(details?.deductions?.total_deduction)}
                    </p>
                  </div>
                  <Shield className="h-6 w-6 text-red-200" />
                </div>
              </div>
            </div>

            {/* Accordion Sections */}
            <div className="bg-white rounded-lg border shadow-sm">
              {/* Employee Information */}
              <SectionHeader title="Employee Information" icon={User} section="employee_info" />
              {expandedSections.employee_info && (
                <div className="p-4 border-t bg-white">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p className="font-medium">{details?.employee_info?.employeeName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Position:</span>
                      <p className="font-medium">{details?.employee_info?.position}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Department:</span>
                      <p className="font-medium">{details?.employee_info?.department}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Employee ID:</span>
                      <p className="font-medium">{details?.employee_info?.employeeID}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Manager ID:</span>
                      <p className="font-medium">{details?.employee_info?.managerID}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Schedule ID:</span>
                      <p className="font-medium">{details?.employee_info?.employee_schedule_id}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pay Calculations */}
              <SectionHeader title="Pay Calculations" icon={DollarSign} section="pay_calculations" />
              {expandedSections.pay_calculations && (
                <div className="p-4 border-t bg-white">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-3 rounded text-center">
                      <p className="text-xs text-green-600 mb-1">Regular Pay</p>
                      <p className="font-semibold text-green-800">
                        {formatCurrency(details?.pay_calculations?.regular_pay)}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded text-center">
                      <p className="text-xs text-blue-600 mb-1">Overtime Pay</p>
                      <p className="font-semibold text-blue-800">
                        {formatCurrency(details?.pay_calculations?.overtime_pay)}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded text-center">
                      <p className="text-xs text-purple-600 mb-1">Bonus Pay</p>
                      <p className="font-semibold text-purple-800">
                        {formatCurrency(details?.pay_calculations?.bonus_pay)}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded text-center">
                      <p className="text-xs text-yellow-600 mb-1">Commission</p>
                      <p className="font-semibold text-yellow-800">
                        {formatCurrency(details?.pay_calculations?.commission_pay)}
                      </p>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded text-center">
                      <p className="text-xs text-indigo-600 mb-1">Performance</p>
                      <p className="font-semibold text-indigo-800">
                        {formatCurrency(details?.pay_calculations?.performance_pay)}
                      </p>
                    </div>
                    <div className="bg-pink-50 p-3 rounded text-center">
                      <p className="text-xs text-pink-600 mb-1">Leave Payment</p>
                      <p className="font-semibold text-pink-800">
                        {formatCurrency(details?.pay_calculations?.leave_payment)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Time & Attendance */}
              <SectionHeader title="Time & Attendance" icon={Clock} section="time_attendance" />
              {expandedSections.time_attendance && (
                <div className="p-4 border-t bg-white">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Regular Hours</p>
                      <p className="font-semibold">{details?.time_attendance?.regular_hours?.toFixed(1)} hrs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Overtime Hours</p>
                      <p className="font-semibold">{details?.time_attendance?.overtime_hours?.toFixed(1)} hrs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Work Time</p>
                      <p className="font-semibold text-xs">{details?.time_attendance?.formatted_work_time}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Overtime</p>
                      <p className="font-semibold text-xs">{details?.time_attendance?.formatted_overtime}</p>
                    </div>
                  </div>
                  
                  {details?.time_attendance?.payroll_period && (
                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium mb-2">Payroll Period</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Start:</span>
                          <p className="font-medium">
                            {details.time_attendance.payroll_period.start_date ? 
                              formatDate(details.time_attendance.payroll_period.start_date) : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">End:</span>
                          <p className="font-medium">
                            {details.time_attendance.payroll_period.end_date ? 
                              formatDate(details.time_attendance.payroll_period.end_date) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Deductions */}
              <SectionHeader title="Deductions" icon={Shield} section="deductions" />
              {expandedSections.deductions && (
                <div className="p-4 border-t bg-white">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="bg-red-50 p-3 rounded text-center">
                      <p className="text-xs text-red-600 mb-1">
                        {details?.deductions?.taxes?.name || 'Taxes'}
                      </p>
                      <p className="font-semibold text-red-800">
                        {formatCurrency(details?.deductions?.taxes?.amount)}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded text-center">
                      <p className="text-xs text-blue-600 mb-1">Health Insurance</p>
                      <p className="font-semibold text-blue-800">
                        {formatCurrency(details?.deductions?.health_insurance?.amount)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded text-center">
                      <p className="text-xs text-green-600 mb-1">Social Security</p>
                      <p className="font-semibold text-green-800">
                        {formatCurrency(details?.deductions?.social_security_amount)}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded text-center">
                      <p className="text-xs text-purple-600 mb-1">Retirement</p>
                      <p className="font-semibold text-purple-800">
                        {formatCurrency(details?.deductions?.retirement_amount)}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded text-center">
                      <p className="text-xs text-yellow-600 mb-1">Voluntary</p>
                      <p className="font-semibold text-yellow-800">
                        {formatCurrency(details?.deductions?.voluntary_deduction?.amount)}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded text-center">
                      <p className="text-xs text-orange-600 mb-1">Advances</p>
                      <p className="font-semibold text-orange-800">
                        {formatCurrency(details?.deductions?.advances_amount)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Leave Information */}
              <SectionHeader title="Leave Information" icon={Calendar} section="leave_info" />
              {expandedSections.leave_info && (
                <div className="p-4 border-t bg-white">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Days Used</p>
                      <p className="font-semibold">{details?.leave_info?.total_leave_days_used}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Leave Payment</p>
                      <p className="font-semibold">{formatCurrency(details?.leave_info?.leave_payment)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Records</p>
                      <p className="font-semibold">{details?.leave_info?.payable_leave_ids?.length || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance */}
              <SectionHeader title="Performance" icon={TrendingUp} section="performance" isLast={true} />
              {expandedSections.performance && (
                <div className="p-4 border-t bg-white rounded-b-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500">Performance Score:</span>
                      <p className="font-semibold">{details?.performance?.performance_metrics}%</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Skills:</span>
                      <p className="font-medium text-sm">{details?.performance?.skills}</p>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="text-xs text-gray-500">Feedback:</span>
                      <p className="font-medium text-sm">{details?.performance?.performance_feedback}</p>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="text-xs text-gray-500">Goals:</span>
                      <p className="font-medium text-sm">{details?.performance?.goals}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Processing Info Footer */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Payroll ID: #{selectedPayroll.payrollid}</span>
                <span>Processed: {formatDate(details?.processing_info?.processed_date || selectedPayroll.createdAt)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}