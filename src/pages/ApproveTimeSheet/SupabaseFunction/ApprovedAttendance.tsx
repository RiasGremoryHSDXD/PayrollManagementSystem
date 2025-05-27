import supabase from "../../../config/SupabaseClient";

export async function approvedRejectAttendance(
  attendance_id: number,
  status: string
) {
  const { data, error } = await supabase.rpc("approved_reject_attedance", {
    p_attedance_id: attendance_id,
    p_status: status,
  });

  if (error) {
    console.error("RPC Error (get_attendance_history):", error);
    return null;
  }

  return data;
}
