import supabase from "../../../config/SupabaseClient";

export async function time_off_approval(manager_id: number) {
  const { data, error } = await supabase.rpc("get_all_employee_leave_request", {
    manager_id: manager_id,
  });

  if (error) {
    console.error("RPC error:", error);
    return null;
  }

  return data;
}
