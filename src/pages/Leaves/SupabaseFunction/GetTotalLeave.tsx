import supabase from "../../../config/SupabaseClient";

export async function get_max_leave_day(leave_type: string){

    const { data, error } = await supabase.rpc(
        'get_max_leave_day', {
            user_leave_type : leave_type
        }
    )

    if(error){
        console.log('RPC error:', error)
        return null
    }

    return data
}