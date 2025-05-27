import supabase from "../../../config/SupabaseClient";

export async function getPerformanceMetrics(employeeScheduleId: number | null) {
  const { data, error } = await supabase.rpc(
    "get_employee_performance_metrics",
    {
      emp_schedule_id: employeeScheduleId,
    }
  );

  if (error) {
    console.error("RPC error:", error);
    return null;
  }

  return data; // an array of { skills, performance_metrics, performance_feedback, goals }
}
