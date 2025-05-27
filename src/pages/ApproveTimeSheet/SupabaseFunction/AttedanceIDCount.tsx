import supabase from "../../../config/SupabaseClient";

export async function getApprovedAttendanceIDs(employee_scheduled_id: number, manager_id: number) {
    const { data, error } = await supabase
        .rpc('get_approved_attendance_ids', {
            emp_sched_id : employee_scheduled_id,
            manager_id : manager_id
        });

    if (error) {
        console.error('RPC error:', error);
        return null;
    }

    return data;
}

export async function getRejectedAttendanceIDs(employee_scheduled_id: number, manager_id: number) {
    const { data, error } = await supabase
        .rpc('get_rejected_attendance_ids', {
            emp_sched_id : employee_scheduled_id,
            manager_id : manager_id
        });

    if (error) {
        console.error('RPC error:', error);
        return null;
    }

    return data;
}
