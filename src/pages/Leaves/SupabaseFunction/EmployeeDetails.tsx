import supabase from "../../../config/SupabaseClient";

export async function employee_details(email: any, password: any) {
  const { data, error } = await supabase.rpc("employee_information", {
    inputted_username: email,
    inputted_password: password,
  });

  if (error) {
    console.error("RPC error:", error);
    return null;
  }

  return data;
}
