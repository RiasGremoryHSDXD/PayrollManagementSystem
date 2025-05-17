// src/Payroll/PayrollPage.tsx
import { useEffect, useState } from "react"
import { fetchPayrollData, PayrollEntry } from "../../Payroll/payrollDB/payrolldb"
import "../css/payroll.css"

export default function PayrollPage() {
  const [data, setData] = useState<PayrollEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchPayrollData()
      setData(result)
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) return <p>Loading...</p>
  if (!loading && data.length === 0) return <p>No payroll history available.</p>

  return (
    <div className="payroll-container">
      <h1>Payment History</h1>
      {data.map((entry) => (
        <div className="payroll-card" key={entry.id}>
          <h2>
            {entry.start_date} – {entry.end_date}
          </h2>
          <p>Pay Date: {entry.pay_date}</p>

          <div className="payroll-section">
            <h3>Earnings</h3>
            <ul>
              <li>Base Salary: ${entry.base_salary.toFixed(2)}</li>
              <li>Overtime: ${entry.overtime.toFixed(2)}</li>
              <li>Bonus: ${entry.bonus.toFixed(2)}</li>
              <li>Commission: ${entry.commission.toFixed(2)}</li>
              <li className="highlight">Gross Pay: ${entry.gross_pay.toFixed(2)}</li>
            </ul>
          </div>

          <div className="payroll-section">
            <h3>Deductions</h3>
            <ul>
              <li>Total Deductions: ${entry.deductions.toFixed(2)}</li>
              <li className="highlight">Net Pay: ${entry.net_pay.toFixed(2)}</li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
