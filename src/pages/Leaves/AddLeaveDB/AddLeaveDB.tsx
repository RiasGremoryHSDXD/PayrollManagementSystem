import supabase from "../../../config/SupabaseClient"

// export async function insertLeaveWithDetails(params: {
//   startdate: string            // e.g. '2025-05-15'
//   enddate: string              // e.g. '2025-05-16'
//   daysrequested: number
//   reason: string
//   status: 'Pending' | 'Approved' | 'Rejected'  // your leave_status enum
//   approvedby: number
//   approvaldate: string | null
//   notes: string | null
//   leave_type: number
//   employeescheduleid: number
// }) 
// {
//     // Create a new object with parameters in the exact order that PostgreSQL expects
//   const orderedParams = {
//     approvaldate: params.approvaldate,
//     approvedby: params.approvedby,
//     daysrequested: params.daysrequested,
//     employeescheduleid: params.employeescheduleid,
//     enddate: params.enddate,
//     leave_type: params.leave_type,
//     notes: params.notes,
//     reason: params.reason,
//     startdate: params.startdate,
//     status: params.status
//   };
//   const { data, error } = await supabase
//     .rpc('insert_leave_details_procedure', orderedParams )  // :contentReference[oaicite:0]{index=0}

//   if (error) {
//     console.error('RPC insert error:', error)
//     throw error
//   }
//   return data
// }

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
