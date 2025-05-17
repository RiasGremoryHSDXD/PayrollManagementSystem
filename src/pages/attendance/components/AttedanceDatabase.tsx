import supabase from "../../../config/SupabaseClient";

export async function getShiftRotations(employeeName: string) {
  const { data, error } = await supabase.rpc("get_shift_rotations", {
    employee_name: employeeName,
  });

  if (error) {
    console.error("RPC Error (get_shift_rotations):", error);
    return null;
  }

  return data;
}
