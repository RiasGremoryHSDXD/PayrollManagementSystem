import supabase from "../../../config/SupabaseClient";

export async function updateClockOut(
  attendanceId: number,
  outDate: string,
  outTime: string,
  otMinutes: number
) {
  const { data, error } = await supabase.rpc("clock_out", {
    p_attendanceid: attendanceId,
    p_out_date: outDate,
    p_out_time: outTime,
    p_ot_minutes: otMinutes,
  });

  if (error) {
    console.error("Clock-Out Error:", error);
    return false;
  }

  return data;
}
