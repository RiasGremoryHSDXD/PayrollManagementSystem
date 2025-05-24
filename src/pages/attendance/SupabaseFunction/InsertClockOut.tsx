import supabase from "../../../config/SupabaseClient";

export async function insertClockOut(current_date : Date, employee_schedule_id: number, time:string) {
    const { error } = await supabase.rpc('clock_out', {
            p_current_date: current_date,
            p_employee_schedule_id: employee_schedule_id,
            p_time_out: time
        })

    if(error){
        console.error("Clock-Out Error:", error);
    }

    return;
}