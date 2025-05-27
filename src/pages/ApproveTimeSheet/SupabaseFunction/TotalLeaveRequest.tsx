import supabase from '../../../config/SupabaseClient';

export async function getCurrentLeaveDaysUsed(
  empSchedId: number,
  cutoffDate?: string     // e.g. '2025-05-27'; omit to use default = today
) {
  // Supabase RPC parameters must exactly match the function signature
  const params: { emp_sched_id: number; cutoff_date?: string } = {
    emp_sched_id: empSchedId,
  };
  if (cutoffDate) params.cutoff_date = cutoffDate;

  const { data, error } = await supabase
    .rpc('get_current_leave_days_used', params);

  if (error) {
    console.error('RPC Error (get_current_leave_days_used):', error);
    return null;
  }

  return data as number;  // the function returns INT
}
