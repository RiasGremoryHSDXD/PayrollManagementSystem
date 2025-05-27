import supabase from "../../../config/SupabaseClient";

export async function insertLeaveWithDetails(
  p_startdate: string,
  p_enddate: string,
  p_daysrequested: number,
  p_reason: string,
  p_status: string,
  p_approvedby: number,
  p_approvaldate: string | null,
  p_notes: string | null,
  p_leavetypeid: number,
  p_employeescheduleid: number
) {
  const { data, error } = await supabase.rpc('insert_leave_details_fn', {

    p_startdate,
    p_enddate,
    p_daysrequested,
    p_reason,
    p_status,
    p_approvedby,
    p_approvaldate,
    p_notes,
    p_leavetypeid,
    p_employeescheduleid,
  });

  if (error) {
    console.error('RPC insert error:', error);
    throw error;
  }
  return data;
}
