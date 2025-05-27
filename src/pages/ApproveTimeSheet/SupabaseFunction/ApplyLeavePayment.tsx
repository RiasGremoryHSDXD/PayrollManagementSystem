import supabase from "../../../config/SupabaseClient";

export async function applyLeavePayments(
  employeeScheduleId: number,
  cutoffDate: string      
) {
  const { error } = await supabase.rpc("apply_leave_payments", {
    emp_sched_id: employeeScheduleId,
    cutoff_date:  cutoffDate,
  });
  if (error) console.error("RPC error (apply_leave_payments):", error);
}
