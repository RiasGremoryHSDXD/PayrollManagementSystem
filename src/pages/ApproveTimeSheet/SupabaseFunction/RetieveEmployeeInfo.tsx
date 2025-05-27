import supabase from "../../../config/SupabaseClient";

export async function getEmployeeDetailsForPayroll(manager_id: number) {
  const { data, error } = await supabase.rpc(
    "get_employee_details_for_payroll",
    {
      p_manager_id: manager_id,
    }
  );

  if (error)
    console.log("Error message get_employee_details_for_payroll", error);

  return data;
}
