import supabase from "../../../config/SupabaseClient";

export async function getEmployeePayrolls(employeeId: number, payroll_number: number) {
    const { data, error } = await supabase.rpc(
        'get_employee_payrolls_two', {
            p_employee_id: employeeId,
            payroll_id: payroll_number
        }
    )

    if (error) {
        console.log('RPC error:', error)
        return null
    }

    return data
}