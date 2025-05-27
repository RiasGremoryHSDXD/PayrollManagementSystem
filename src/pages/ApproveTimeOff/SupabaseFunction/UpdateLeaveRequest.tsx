import supabase from "../../../config/SupabaseClient";

export async function update_employee_leave_status(
  managerid: number,
  leaveid: number,
  leavestatus: string
) {
  const { data, error } = await supabase.rpc("update_employee_leave_status", {
    manager_id: managerid,
    leave_id: leaveid,
    leave_status: leavestatus,
  });

  if (error) {
    console.error("RPC Error (update_employee_leave_status):", error);
    return null;
  }

  return data;
}
