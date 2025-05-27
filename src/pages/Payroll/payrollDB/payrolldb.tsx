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

  voluntary_deductions?: { name: string; amount: number }[];
  loans?: { name: string; amount: number }[];
  advances?: { name: string; amount: number }[];
}

export async function fetchPayrollData(): Promise<PayrollEntry[]> {

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

  const voluntaryItems = voluntary?.map((d) => ({
    name: d.description || "Voluntary Deduction",
    amount: Number(d.amount ?? 0),
  })) ?? [];

  const loanItems = loans?.map((l) => ({
    name: l.description || "Loan Payment",
    amount: Number(l.principalrepaid ?? 0),
  })) ?? [];

  const advanceItems = advances?.map((a) => ({
    name: a.description || "Advance",
    amount: Number(a.amount ?? 0),
  })) ?? [];

  const total_deductions = [
    ...voluntaryItems,
    ...loanItems,
    ...advanceItems,
  ].reduce((sum, item) => sum + item.amount, 0);

  const gross_pay = base_salary + overtime + bonus + commission;
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

    // Include breakdown
    voluntary_deductions: voluntary?.map((d) => ({
      name: d.description || "Voluntary",
      amount: Number(d.amount ?? 0),
    })),
    loans: loans?.map((l) => ({
      name: l.description || "Loan",
      amount: Number(l.principalrepaid ?? 0),
    })),
    advances: advances?.map((a) => ({
      name: a.description || "Advance",
      amount: Number(a.amount ?? 0),
    })),
  },
]

}
