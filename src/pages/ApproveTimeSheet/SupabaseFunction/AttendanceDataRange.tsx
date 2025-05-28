import supabase from "../../../config/SupabaseClient";

export async function getAttendanceDateRange(attendanceIds: number[]) {
  const { data, error } = await supabase
    .rpc("get_attendance_date_range_by_attendance_ids", {
      att_ids: attendanceIds,  // match the function’s parameter name
    });

  if (error) {
    console.error("Error fetching attendance date range:", error);
    return null;
  }

  // data will be [{ start_date: string, end_date: string }]
  return data as { start_date: string; end_date: string }[];
}
