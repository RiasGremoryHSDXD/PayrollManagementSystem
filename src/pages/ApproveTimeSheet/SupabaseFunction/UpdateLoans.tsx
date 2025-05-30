import supabase from "../../../config/SupabaseClient";

export async function updateLoadBySchedule(employeeScheduleID : number , principal_payment : number) {
  const { data, error } = await supabase.rpc("update_loan_by_schedule", {
    p_employeescheduleid : employeeScheduleID,
    p_principal_payment: principal_payment
  });

  if (error) {
    console.error("RPC Error (update_loan_by_schedule):", error);
    return null;
  }

  return data; 
}
