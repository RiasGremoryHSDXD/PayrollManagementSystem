import supabase from "../../../config/SupabaseClient";

export async function time_off_approval() {
  const { data, error } = await supabase.rpc("get_all_employee_leave_request");

  if (error) {
    console.error("RPC error:", error);
    return null;
  }

  return data;
}
