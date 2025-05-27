import supabase from "../../../config/SupabaseClient";

export async function getAttendanceHistory(
  empSchedId: number,
  manager_id: number
) {
  const { data, error } = await supabase.rpc("get_attendance_history", {
    emp_sched_id: empSchedId,
    manager_id: manager_id,
  });

  if (error) {
    console.error("RPC Error (get_attendance_history):", error);
    return null;
  }

  return data;
}
