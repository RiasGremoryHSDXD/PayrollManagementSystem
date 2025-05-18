import supabase from "../../../config/SupabaseClient";

export async function insertClockIn(
  empSchedId: number,
  date: string,
  time: string
) {
  const { error } = await supabase.rpc("clock_in", {
    emp_sched_id: empSchedId,
    in_date: date,
    in_time: time,
  });

  if (error) {
    console.error("Clock-In Error:", error);
    return false;
  }

  return true;
}
