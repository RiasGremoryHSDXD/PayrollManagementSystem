import supabase from "../../../config/SupabaseClient";

export interface PayrollEntry {
  id: number;
  start_date: string;
  end_date: string;
  pay_date: string;
  base_salary: number;
  overtime: number;
  bonus: number;
  commission: number;
  gross_pay: number;
  deductions: number;
  net_pay: number;
}

export async function fetchPayrollData(): Promise<PayrollEntry[]> {
  const employee = 1; // Can be made dynamic

  const [
    { data: compPlan },
    { data: overTimeRate },
    { data: bonusRate },
    { data: commissionRate },
    { data: voluntary },
    { data: loans },
    { data: advances },
  ] = await Promise.all([
    supabase.from("compensation_plan").select("*").limit(1),
    supabase.from("over_time_rate").select("*").limit(1),
    supabase.from("bonus_rate").select("*").limit(1),
    supabase.from("commission_rate").select("*").limit(1),
    supabase.from("voluntary_deduction").select("*"),
    supabase.from("outstanding_loans").select("*"),
    supabase.from("advances").select("*"),
  ]);

  const base_salary = compPlan?.[0]?.basesalary ?? 0;
  const overtime = overTimeRate?.[0]?.overtimerate ?? 0;
  const bonus = bonusRate?.[0]?.bonusrate ?? 0;
  const commission = commissionRate?.[0]?.commissionrate ?? 0;

  const gross_pay = base_salary + overtime + bonus + commission;

  const voluntaryDeduction = voluntary?.reduce(
    (sum, d) => sum + Number(d.amount ?? 0),
    0
  );
  const loanInstallments = loans?.reduce(
    (sum, l) => sum + Number(l.principalrepaid ?? 0),
    0
  );
  const advanceAmounts = advances?.reduce(
    (sum, a) => sum + Number(a.amount ?? 0),
    0
  );

  const total_deductions =
    voluntaryDeduction + loanInstallments + advanceAmounts;
  const net_pay = gross_pay - total_deductions;

  return [
    {
      id: 1,
      start_date: "2025-05-01",
      end_date: "2025-05-15",
      pay_date: "2025-05-16",
      base_salary,
      overtime,
      bonus,
      commission,
      gross_pay,
      deductions: total_deductions,
      net_pay,
    },
  ];
}
