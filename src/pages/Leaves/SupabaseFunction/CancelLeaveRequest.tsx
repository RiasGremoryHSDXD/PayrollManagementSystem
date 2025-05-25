import supabase from "../../../config/SupabaseClient";

export async function cancelLeaveRequest(employee_leave_id: number) {
    const { error } = await supabase.rpc('cancel_leave_request', {
        employee_leave_id: employee_leave_id
    })

    if(error){
        console.log("Error in cancel_leave_request", error)
    }

    return;
}