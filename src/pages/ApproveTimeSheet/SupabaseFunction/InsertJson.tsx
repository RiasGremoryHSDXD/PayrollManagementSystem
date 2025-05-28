// SupabaseFunction/CreatePayroll.ts
import supabase from "../../../config/SupabaseClient";

interface PayrollDetails {
  employee_info: {
    employeeID: number;
    employeeName: string;
    position: string;
    department: string;
    employee_schedule_id: number;
    managerID: number;
  };
  schedule_info: {
    shift_start_time: string;
    shift_end_time: string;
    formatted_shift_start: string;
    formatted_shift_end: string;
  };
  time_attendance: {
    total_work_time: string;
    total_overtime: string;
    formatted_work_time: string;
    formatted_overtime: string;
    regular_hours: number;
    overtime_hours: number;
    approved_attendance_ids: number[];
    payroll_period: {
      start_date: string | undefined;
      end_date: string | undefined;
    };
  };
  leave_info: {
    total_leave_days_used: number;
    leave_payment: number;
    payable_leave_ids: any[];
  };
  compensation_rates: {
    base_salary: number;
    bonus_rate: number;
    commission_rate: number;
    overtime_rate: number;
  };
  pay_calculations: {
    regular_pay: number;
    overtime_pay: number;
    bonus_pay: number;
    commission_pay: number;
    performance_pay: number;
    leave_payment: number;
    gross_pay: number;
    net_pay: number;
    total_bonuses: number;
  };
  deductions: {
    taxes: {
      name: string;
      amount: number;
    };
    health_insurance: {
      name: string;
      amount: number;
    };
    social_security_amount: number;
    retirement_amount: number;
    additional_benefits_amount: number;
    voluntary_deduction: {
      amount: number;
      description: string;
    };
    outstanding_loans: {
      original_amount: number;
      principal_repaid: number;
      interest_rate: number;
    };
    advances_amount: number;
    total_deduction: number;
  };
  performance: {
    skills: string;
    performance_metrics: number;
    performance_feedback: string;
    goals: string;
  };
  formatted_amounts: {
    gross_pay: string;
    net_pay: string;
    total_deductions: string;
    leave_payment: string;
    total_bonuses: string;
  };
  processing_info: {
    processed_date: string;
    processed_timestamp: string;
  };
}

interface PayrollData {
  employeeID: number;
  payrollDetails: PayrollDetails;
}

export const createPayroll = async (employeeData: PayrollData) => {
  try {
    const { data, error } = await supabase.rpc('create_payroll', {
      p_employee_id: employeeData.employeeID,
      p_details: employeeData.payrollDetails
    });

    if (error) {
      console.error('Error creating payroll:', error);
      throw error;
    }

    return data; // Returns the new payrollID
  } catch (error) {
    console.error('Error in createPayroll function:', error);
    throw error;
  }
};