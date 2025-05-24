import supabase from "../../../config/SupabaseClient";

export async function attendanceID() {
  const { data, error } = await supabase.rpc("get_latest_attendance_id");

  if (error) {
    console.error("RPC error:", error);
    return null;
  }

  return data;
}
