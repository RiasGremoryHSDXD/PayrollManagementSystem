import supabase from "../../../config/SupabaseClient"

export async function insertLeaveWithDetails(
p_startdate: any,
p_enddate: any,
p_daysrequested: any,
p_reason: any,
p_status: any,
p_approvedby: any,
p_approvaldate: any,
p_notes: any,
p_leavetypeid: any,
p_employeescheduleid: any,

) {
  const { data, error } = await supabase
    .rpc('insert_leave_details_fn', {
        p_startdate: p_startdate,
        p_enddate: p_enddate,
        p_daysrequested: p_daysrequested,
        p_reason: p_reason,
        p_status: p_status,
        p_approvedby: p_approvedby,
        p_approvaldate: p_approvaldate,
        p_notes: p_notes,
        p_leavetypeid: p_leavetypeid,
        p_employeescheduleid: p_employeescheduleid,
    })  

  if (error) {
    console.error('RPC insert error:', error)
    throw error
  }
  return data
}
