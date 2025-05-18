import supabase from "../../../config/SupabaseClient";

export async function updateClockOut(
  empSchedId: number,
  date: string,
  time: string,
  ot: number
) {
  const { error } = await supabase.rpc("clock_out", {
    emp_sched_id: empSchedId,
    out_date: date,
    out_time: time,
    ot_minutes: ot,
  });

  if (error) {
    console.error("Clock-Out Error:", error);
    return false;
  }

  return true;
}
