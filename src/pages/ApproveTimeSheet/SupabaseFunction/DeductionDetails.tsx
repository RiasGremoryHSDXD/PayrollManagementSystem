import supabase from "../../../config/SupabaseClient";

export async function getEmployeeDeductions(employeeScheduleId: number | null) {
  const { data, error } = await supabase
    .rpc("get_employee_deductions", {
      emp_schedule_id: employeeScheduleId,
    });

  if (error) {
    console.error("RPC error:", error);
    return null;
  }

  return data;
}
