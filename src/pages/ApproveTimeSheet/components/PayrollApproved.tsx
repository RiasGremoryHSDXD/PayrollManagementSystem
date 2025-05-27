import { use, useEffect, useState } from "react";
import {
  CheckCircle,
  User,
  MapPin,
  Clock,
  DollarSign,
  Award,
  TrendingUp,
  Zap,
  Calculator,
  Minus,
  Plus,
  Target,
  Star,
  Calendar,
} from "lucide-react";
import { getTotalWorkAndOvertime } from "../SupabaseFunction/TotalWorkOverTime";
import { getEmployeeDeductions } from "../SupabaseFunction/DeductionDetails";
import { getPerformanceMetrics } from "../SupabaseFunction/PerformanceMetric";
import { getCurrentLeaveDaysUsed } from "../SupabaseFunction/TotalLeaveRequest"; 
import { getApprovedAttendanceIDs, getRejectedAttendanceIDs } from "../SupabaseFunction/AttedanceIDCount";
import { getPayableLeaveIDs } from "../SupabaseFunction/LeaveIDPaid";
import { markAttendancePaid } from "../SupabaseFunction/MarkAttendancePaid";
import { applyLeavePayments } from "../SupabaseFunction/ApplyLeavePayment";

interface PayrollApprovedProps {
  employeeID: number | null;
  employeeName: string;
  position: string;
  department: string;
  shift_start_time: string;
  shift_end_time: string;
  bonusRate: number;
  commissionRate: number;
  overTimeRate: number;
  baseSaraly: number;
  managerID: number;
  employee_schedule_id: number
  onClose: () => void;
}

export default function PayrollApproved({
  employeeID,
  employeeName,
  position,
  department,
  shift_start_time,
  shift_end_time,
  bonusRate,
  commissionRate,
  overTimeRate,
  baseSaraly,
  managerID,
  employee_schedule_id,
  onClose
}: PayrollApprovedProps) {

  const [totalWorkTime, setTotalWorkTime] = useState<string>('')
  const [totalOverTime, setOverTime] = useState<string>('')
  const [taxesName, setTaxesName] = useState<string>('');  
  const [taxesAmount, setTaxesAmount] = useState<string>('0');
  const [healthInsuranceName, setHealthInsuranceName] = useState<string>('');
  const [healthInsuranceAmount, setHealthInsuranceAmount] = useState<string>('0');
  const [socialSecurityAmount, setSocialSecurityAmount] = useState<string>('0');
  const [retirementAmount, setRetirementAmount] = useState<string>('0');
  const [additionalBenefitsAmount, setAdditionalBenefitsAmount] = useState<string>('0');
  const [voluntaryDeductionAmount, setVoluntaryDeductionAmount] = useState<string>('0');
  const [voluntaryDeductionDescription, setVoluntaryDeductionDescription] = useState<string>('');
  const [outstandingLoansOriginal, setOutstandingLoansOriginal] = useState<string>('0');
  const [outstandingLoansPrincipalRepaid, setOutstandingLoansPrincipalRepaid] = useState<string>('0');
  const [outstandingLoansInterestRate, setOutstandingLoansInterestRate] = useState<string>('0');
  const [advancesAmount, setAdvancesAmount] = useState<string>('0');
  const [totalDeduction, setTotalDeduction] = useState<string>('0');
  const [skills, setSkills] = useState<string>('');
  const [performanceMetrics, setPerformanceMetrics] = useState<number>(0);
  const [performanceFeedback, setPerformanceFeedback] = useState<string>('');
  const [goals, setGoals] = useState<string>('');
  const [totalBonuses, setTotalBonuses] = useState<string>('0');
  const [totalLeaveUsed, setTotalLeave] = useState<number>(0)
  
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(numAmount);
  };
  

  const parseTimeToHours = (timeString: string) => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours + (minutes / 60);
  };

  const calculateLeavePayment = () => {
    // baseSaraly is already an hourly rate
    return totalLeaveUsed * 8 * baseSaraly; // 8 hours per day * hourly rate
  };


  const calculateGrossPay = () => {
    const regularHours = parseTimeToHours(totalWorkTime);
    const overtimeHours = parseTimeToHours(totalOverTime);
    
    const regularPay = regularHours * baseSaraly; // baseSaraly is hourly rate
    const overtimePay = overtimeHours * baseSaraly * (overTimeRate / 100 + 1);
    const bonusPay = baseSaraly * (bonusRate / 100);
    const commissionPay = baseSaraly * (commissionRate / 100);
    const performancePay = baseSaraly * ((performanceMetrics / 100) / 100); // Performance-based pay
    const leavePayment = calculateLeavePayment();
    
    return regularPay + overtimePay + bonusPay + commissionPay + performancePay + leavePayment;
  };

  const calculateTotalBonuses = () => {
    const overtimeHours = parseTimeToHours(totalOverTime);
    
    const overtimePay = overtimeHours * baseSaraly * (overTimeRate / 100 + 1);
    const bonusPay = baseSaraly * (bonusRate / 100);
    const commissionPay = baseSaraly * (commissionRate / 100);
    const performancePay = baseSaraly * (performanceMetrics / 100);
    const leavePayment = calculateLeavePayment();
    
    return overtimePay + bonusPay + commissionPay + performancePay + leavePayment;
  };

  const calculateNetPay = () => {
    const grossPay = calculateGrossPay();
    const deductions = parseFloat(totalDeduction) || 0;
    return grossPay - deductions;
  };

  const handleTotalTimeRelated = async () => {
    const result = await getTotalWorkAndOvertime(employee_schedule_id, managerID)
    if (result && result.length > 0) {
      setTotalWorkTime(result[0].total_work_time || '0:00')
      setOverTime(result[0].total_over_time || '0:00')
    }
  }

  const handlePerformanceMetric = async () => {
    const result = await getPerformanceMetrics(employee_schedule_id);
    
    if (!result || result.length === 0) return;

    const m = result[0];
    setSkills(m.skills ?? "");
    setPerformanceMetrics(m.performance_metrics || 0);
    setPerformanceFeedback(m.performance_feedback ?? "");
    setGoals(m.goals ?? "");
  };

  const handleDeductionDetail = async () => {
    const result = await getEmployeeDeductions(employee_schedule_id);
    
    if (!result || result.length === 0) return;

    const d = result[0];
    setTaxesName(d.taxes_name ?? "");
    setTaxesAmount(d.taxes_amount || '0');
    setHealthInsuranceName(d.health_insurance_name ?? "");
    setHealthInsuranceAmount(d.health_insurance_amount || '0');
    setSocialSecurityAmount(d.social_security_amount || '0');
    setRetirementAmount(d.retirement_amount || '0');
    setAdditionalBenefitsAmount(d.additional_benefits_amount ?? '0');
    setVoluntaryDeductionAmount(d.voluntary_deduction_amount ?? '0');
    setVoluntaryDeductionDescription(d.voluntary_deduction_description ?? "");
    setOutstandingLoansOriginal(d.outstanding_loans_original ?? '0');
    setOutstandingLoansPrincipalRepaid(d.outstanding_loans_principal_repaid ?? '0');
    setOutstandingLoansInterestRate(d.outstanding_loans_interest_rate ?? '0');
    setAdvancesAmount(d.advances_amount ?? '0');
    setTotalDeduction(d.total_deduction || '0');
  };


  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatWorkTime = (timeString: string) => {
    if (!timeString) return '0h 0m';
    const [hours, minutes] = timeString.split(':').map(Number);
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    handleTotalTimeRelated()
    handleDeductionDetail()
    handlePerformanceMetric()
    handleLeaveData()
  }, [])

    const handleLeaveData = async () => {
    if (employee_schedule_id) {
      const now = new Date();
      const year  = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day   = String(now.getDate()).padStart(2, '0');

      const today = `${year}-${month}-${day}`;
      const leaveDaysUsed = await getCurrentLeaveDaysUsed(employee_schedule_id, today);
      setTotalLeave(leaveDaysUsed || 0);
    }
  };

  // Calculate total bonuses when relevant data changes
  useEffect(() => {
    if (totalWorkTime && totalOverTime) {
      const bonuses = calculateTotalBonuses();
      setTotalBonuses(bonuses.toString());
    }
  }, [totalWorkTime, totalOverTime, baseSaraly, bonusRate, commissionRate, overTimeRate, performanceMetrics, totalLeaveUsed])

  const grossPay = calculateGrossPay();
  const netPay = calculateNetPay();
  const leavePayment = calculateLeavePayment();

  const handlePayrollEmployee = async () => {
    if (!employee_schedule_id) return;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

    const approvedRows = await getApprovedAttendanceIDs(employee_schedule_id, managerID);
    const leaveRows    = await getPayableLeaveIDs(employee_schedule_id, today);
    const approvedIds = (approvedRows || []).map((r: { attendanceid: number }) => r.attendanceid);
    const leaveIds    = leaveRows || []; 

    await markAttendancePaid(approvedIds);
    await applyLeavePayments(employee_schedule_id, today)

    alert("Payroll Are successfully")
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-1">
              Payroll Approved
            </h2>
            <p className="text-gray-600">
              Employee payroll has been successfully processed
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Gross Pay, Net Pay, and Total Bonuses Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 md:p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Plus className="w-5 h-5 md:w-6 md:h-6 text-green-600 mr-3" />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                    Gross Pay
                  </h3>
                </div>
                <Calculator className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(grossPay)}
              </p>
              <p className="text-sm text-gray-600">Before deductions</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                    Net Pay
                  </h3>
                </div>
                <Calculator className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                {formatCurrency(netPay)}
              </p>
              <p className="text-sm text-gray-600">After deductions</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Award className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 mr-3" />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                    Total Bonuses
                  </h3>
                </div>
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2">
                {formatCurrency(totalBonuses)}
              </p>
              <p className="text-sm text-gray-600">Extra earnings</p>
            </div>
          </div>

          {/* Employee Information and Work Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employee Information Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                    {employeeName}
                  </h3>
                  <p className="text-purple-600 font-medium">
                    ID: #{employeeID || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5  text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-medium text-gray-800">{position}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium text-gray-800">{department}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Summary */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-orange-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-800">
                  Work Summary
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-600">
                    Total Work Time
                  </span>
                  <span className="font-semibold text-gray-800">
                    {formatWorkTime(totalWorkTime)}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-600">
                    Overtime
                  </span>
                  <span className="font-semibold text-orange-600">
                    {formatWorkTime(totalOverTime)}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-600">
                    Shift
                  </span>
                  <span className="font-semibold text-gray-800">
                    {formatTime(shift_start_time)} -{" "}
                    {formatTime(shift_end_time)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Summary */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-cyan-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-800">
                Leave Summary
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-cyan-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Total Leave Days Used
                  </span>
                  <Calendar className="w-4 h-4 text-cyan-600" />
                </div>
                <p className="text-2xl font-bold text-cyan-600 mb-1">
                  {totalLeaveUsed} {totalLeaveUsed === 1 ? 'day' : 'days'}
                </p>
                <p className="text-xs text-gray-500">Approved leave requests</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Leave Payment
                  </span>
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600 mb-1">
                  {formatCurrency(leavePayment)}
                </p>
                <p className="text-xs text-gray-500">
                  {totalLeaveUsed} days × 8 hours × ₱{baseSaraly.toFixed(2)}/hr
                </p>
              </div>
            </div>
          </div>

          {/* Compensation Structure */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center mb-4">
              <DollarSign className="w-6 h-6 text-green-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-800">
                Compensation Structure
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Base Salary
                  </span>
                </div>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(baseSaraly)}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center mb-2">
                  <Award className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Bonus Rate
                  </span>
                </div>
                <p className="text-xl font-bold text-blue-600">{bonusRate}%</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Commission Rate
                  </span>
                </div>
                <p className="text-xl font-bold text-purple-600">
                  {commissionRate}%
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <div className="flex items-center mb-2">
                  <Zap className="w-4 h-4 text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Overtime Rate
                  </span>
                </div>
                <p className="text-xl font-bold text-orange-600">
                  {overTimeRate}%
                </p>
              </div>
            </div>
          </div>

          {/* Deductions Details */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100">
            <div className="flex items-center mb-4">
              <Minus className="w-6 h-6 text-red-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-800">
                Deductions Breakdown
              </h4>
              <div className="ml-auto bg-red-100 px-3 py-1 rounded-full">
                <span className="text-sm font-semibold text-red-600">
                  Total: {formatCurrency(totalDeduction)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {taxesAmount !== "0" && (
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {taxesName || "Taxes"}
                  </p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(taxesAmount)}
                  </p>
                </div>
              )}

              {healthInsuranceAmount !== "0" && (
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {healthInsuranceName || "Health Insurance"}
                  </p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(healthInsuranceAmount)}
                  </p>
                </div>
              )}

              {socialSecurityAmount !== "0" && (
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Social Security
                  </p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(socialSecurityAmount)}
                  </p>
                </div>
              )}

              {retirementAmount !== "0" && (
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Retirement Fund
                  </p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(retirementAmount)}
                  </p>
                </div>
              )}

              {voluntaryDeductionAmount !== "0" && (
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {voluntaryDeductionDescription || "Voluntary Deduction"}
                  </p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(voluntaryDeductionAmount)}
                  </p>
                </div>
              )}

              {advancesAmount !== "0" && (
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Advances
                  </p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(advancesAmount)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          {(skills || performanceFeedback || goals) && (
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-center mb-4">
                <Star className="w-6 h-6 text-indigo-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-800">
                  Performance Overview
                </h4>
                <div className="ml-auto bg-indigo-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-indigo-600">
                    Score: {performanceMetrics}/10
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {skills && (
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-center mb-2">
                      <Target className="w-4 h-4 text-indigo-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">
                        Skills
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{skills}</p>
                  </div>
                )}

                {performanceFeedback && (
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">
                        Feedback
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">
                      {performanceFeedback}
                    </p>
                  </div>
                )}

                {goals && (
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-center mb-2">
                      <Target className="w-4 h-4 text-indigo-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">
                        Goals
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{goals}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={handlePayrollEmployee}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
            >
              Approved Payroll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}