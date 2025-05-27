import supabase from "../../../config/SupabaseClient";

<<<<<<< HEAD
export async function getAttendanceHistory(empSchedId: number, manager_id: number) {
  const { data, error } = await supabase.rpc("get_attendance_history", {
    emp_sched_id: empSchedId,
    manager_id: manager_id
=======
export async function getAttendanceHistory(
  empSchedId: number,
  manager_id: number
) {
  const { data, error } = await supabase.rpc("get_attendance_history", {
    emp_sched_id: empSchedId,
    manager_id: manager_id,
>>>>>>> 656d3b5cb5d3e1dee4aa156bc02a5491294d48cd
  });

  if (error) {
    console.error("RPC Error (get_attendance_history):", error);
    return null;
  }

  return data;
}
