import supabase from "../../../config/SupabaseClient";

export async function get_used_leave(user_employeeScheID: number, leave_type: string){
    
    const { data, error } = await supabase.rpc(
        'get_total_leave_used', {
            user_employeescheid : user_employeeScheID,
            user_leave_type : leave_type
        }
    )

    if(error){
        console.error('RPC error: ', error)
        return null
    }

    return data
}