import supabase from "../../../config/SupabaseClient";

export async function getEmployeeDeductions(employeeScheduleId: number | null) {
<<<<<<< HEAD
  const { data, error } = await supabase
    .rpc("get_employee_deductions", {
      emp_schedule_id: employeeScheduleId,
    });
=======
  const { data, error } = await supabase.rpc("get_employee_deductions", {
    emp_schedule_id: employeeScheduleId,
  });
>>>>>>> 656d3b5cb5d3e1dee4aa156bc02a5491294d48cd

  if (error) {
    console.error("RPC error:", error);
    return null;
  }

  return data;
}
