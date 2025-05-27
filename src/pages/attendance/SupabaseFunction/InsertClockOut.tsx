import supabase from "../../../config/SupabaseClient";

export async function insertClockOut(current_date : Date, employee_schedule_id: number, time:string, current_loction: string | null) {
    const { error } = await supabase.rpc('clock_out', {
            p_current_date: current_date,
            p_employee_schedule_id: employee_schedule_id,
            p_time_out: time,
            current_loc: current_loction
        })

  if (error) {
    console.error("Clock-Out Error:", error);
  }

  return;
}
