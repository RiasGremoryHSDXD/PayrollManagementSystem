import supabase from "../../../config/SupabaseClient";

export async function getPayableLeaveIDs(employee_scheduled_id: number, current_date: string) {
    const { data, error } = await supabase
        .rpc('get_payable_leave_ids', {
            emp_sched_id : employee_scheduled_id,
            cutoff_date : current_date
        });

    if (error) {
        console.error('RPC error:', error);
        return null;
    }

    return data;
}