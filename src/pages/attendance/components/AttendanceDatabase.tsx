import supabase from "../../../config/SupabaseClient";

export async function getShiftRotations() {
  const { data, error } = await supabase.rpc("get_shift_rotations", {});

  if (error) {
    console.error("RPC error:", error);
    return null;
  }

  return data;
}
