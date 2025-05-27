import supabase from "../../../config/SupabaseClient";

<<<<<<< HEAD
export async function getTotalWorkAndOvertime(employee_id: number | null, manager_id: number) {
  const { data, error } = await supabase.rpc("get_total_work_over_time", {
    employee_id,
    managerid: manager_id
=======
export async function getTotalWorkAndOvertime(
  employee_id: number | null,
  manager_id: number
) {
  const { data, error } = await supabase.rpc("get_total_work_over_time", {
    employee_id,
    managerid: manager_id,
>>>>>>> 656d3b5cb5d3e1dee4aa156bc02a5491294d48cd
  });

  if (error) {
    console.error("RPC Error (get_total_work_over_time):", error);
    return null;
  }

  return data; // { total_work_time: "HH:MM:SS", total_over_time: "HH:MM:SS" }
}
