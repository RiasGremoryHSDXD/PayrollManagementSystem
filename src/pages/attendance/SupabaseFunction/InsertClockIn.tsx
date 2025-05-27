import supabase from "../../../config/SupabaseClient";

export async function insertClockIn(
  date: Date,
  empSchedId: number,
  time: string,
  current_loc: string | null
) {
  const { error } = await supabase.rpc("clock_in", {
    emp_sched_id: empSchedId,
    in_date: date,
    in_time: time,
    current_loc: current_loc
  });

  if (error) {
    console.error("Clock-Out Error:", error);
  }

  return;
}
