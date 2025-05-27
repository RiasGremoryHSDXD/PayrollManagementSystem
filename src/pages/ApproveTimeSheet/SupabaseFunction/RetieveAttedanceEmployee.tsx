import supabase from "../../../config/SupabaseClient";

export async function getAttendanceHistory(
  empSchedId: number,
  manager_id: number,
  interval: number | null
) {
  const { data, error } = await supabase.rpc("filter_attendance_history", {
    emp_sche_id: empSchedId,
    manager_id: manager_id,
    date_filter: interval
  });

  if (error) {
    console.error("RPC Error (get_attendance_history):", error);
    return null;
  }

  return data;
}
