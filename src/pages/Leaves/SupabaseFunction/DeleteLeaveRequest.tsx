import supabase from "../../../config/SupabaseClient";

export async function deleteLeaveRequest(leave_id: number) {
    const { error } = await supabase.rpc('delete_leave_request', 
        {
            employee_leave_id: leave_id
        })
    
    if(error) console.log('Error delete_leave_request', error)
    return;    
}