import supabase from "../../../config/SupabaseClient";

export async function markAttendancePaid(attIds: number[]) {
  const { error } = await supabase.rpc("mark_attendance_paid", {
    att_ids: attIds,
  });
  if (error) console.error("RPC error (mark_attendance_paid):", error);
}
