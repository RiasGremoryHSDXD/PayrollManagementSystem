import supabase from "../../../config/SupabaseClient";

export async function validUserClockOut(current_date : Date, employee_schedule_id: number) {
    const { data, error } = await supabase.rpc("valid_user_clock_out", {
            p_current_date: current_date,
            p_employee_schedule_id: employee_schedule_id
        })
    

    if(error){
        console.log("RPC Error (valid_user_clock_out): ", error)
    }

    return data
}