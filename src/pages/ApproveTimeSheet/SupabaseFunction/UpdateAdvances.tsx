import supabase from "../../../config/SupabaseClient";

export async function upDateAdvanceBySchedule(employeeScheduleID : number , amount_deduction : number) {
  const { data, error } = await supabase.rpc("update_advance_by_schedule", {
    p_employeescheduleid : employeeScheduleID,
    p_amount_deduction: amount_deduction
  });

  if (error) {
    console.error("RPC Error (update_advance_by_schedule):", error);
    return null;
  }

  return data; 
}
