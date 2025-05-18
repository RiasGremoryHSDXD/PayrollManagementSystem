import supabase from "../../../config/SupabaseClient";

export async function insertClockIn(
  empSchedId: number,
  date: string,
  time: string
) {
  const { data, error } = await supabase.rpc("clock_in", {
    emp_sched_id: empSchedId,
    in_date: date,
    in_time: time,
  });

  if (error) {
    console.error("Clock-In Error:", error);
  } else {
    const attendanceId = data; // Save this somewhere, like in state or context
    console.log("Clocked in with attendance ID:", attendanceId);
  }

  return true;
}
