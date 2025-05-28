import supabase from "../../../config/SupabaseClient";

export async function getPayrollDatesForEmployee(employeeId: number) {
  const { data, error } = await supabase
    .rpc("get_payroll_dates_for_employee", { in_emp_id: employeeId });

  if (error) {
    console.error("RPC error (get_payroll_dates_for_employee):", error);
    return null;
  }

  // data will be an array of { payrollID: number, payroll_approved_date: string }
  return data as { payrollid: number; payroll_approved_date: string }[];
}
