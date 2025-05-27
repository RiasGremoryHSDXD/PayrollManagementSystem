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
<<<<<<< HEAD
  const { data, error } = await supabase.rpc('insert_leave_details_fn', {
=======
  const { data, error } = await supabase.rpc("insert_leave_details_fn", {
>>>>>>> 656d3b5cb5d3e1dee4aa156bc02a5491294d48cd
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
<<<<<<< HEAD
    console.error('RPC insert error:', error);
    throw error;
  }
  return data;
}
=======
    console.error("RPC insert error:", error);
    throw error;
  }
  return data;
}
>>>>>>> 656d3b5cb5d3e1dee4aa156bc02a5491294d48cd
