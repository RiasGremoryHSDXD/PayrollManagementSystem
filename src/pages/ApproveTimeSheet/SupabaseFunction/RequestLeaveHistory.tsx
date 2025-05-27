import supabase from "../../../config/SupabaseClient";

export async function getLeaveHistory(employee_scheduled_id: number) {
<<<<<<< HEAD
    const { data, error } = await supabase
        .rpc('request_history', {
            employee_schuled_id: employee_scheduled_id,
        });

    if (error) {
        console.error('RPC error:', error);
        return null;
    }

    return data;
}
=======
  const { data, error } = await supabase.rpc("request_history", {
    employee_schuled_id: employee_scheduled_id,
  });

  if (error) {
    console.error("RPC error:", error);
    return null;
  }

  return data;
}
>>>>>>> 656d3b5cb5d3e1dee4aa156bc02a5491294d48cd
