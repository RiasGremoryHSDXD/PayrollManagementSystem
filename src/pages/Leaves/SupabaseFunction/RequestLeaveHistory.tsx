import supabase from "../../../config/SupabaseClient";

export async function getLeaveHistory(employee_scheduled_id: number) {
    const { data, error } = await supabase
        .rpc('request_history', {
            employee_schuled_id: employee_scheduled_id,
        });

    if (error) {
        console.error('RPC error:', error);
        return null;
    }

    return data;
}