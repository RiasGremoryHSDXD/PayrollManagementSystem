import supabase from "../../../config/SupabaseClient";

export async function employeeCompensationDetails(empSchedId: number) {
  const { data, error } = await supabase.rpc("employee_compensation_details", {
    employee_schedule_id: empSchedId,
  });

  if (error) {
    console.error("RPC Error (get_attendance_history):", error);
    return null;
  }

  return data;
}
