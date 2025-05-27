import { useEffect, useState } from "react";
import {
  fetchPayrollData,
  PayrollEntry,
} from "../../Payroll/payrollDB/payrolldb";
import "../css/payroll.css";

export default function PayrollPage() {
  const [data, setData] = useState<PayrollEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchPayrollData();
      setData(result);
      setLoading(false);
    };
    loadData();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <p>Loading...</p>;
  if (!loading && data.length === 0)
    return <p>No payroll history available.</p>;

  return (
    <div className="page-wrapper">
      <h1 className="main-title">Payroll</h1>

      <div className="payroll-container">
        <h2 className="section-title">Payment History</h2>

        {data.map((entry) => (
          <div className="payroll-card" key={entry.id}>
            <div
              className="payroll-header"
              onClick={() => toggleExpand(entry.id)}
            >
              <div>
                <strong>
                  {entry.start_date} – {entry.end_date}
                </strong>
                <div className="pay-date">Pay date: {entry.pay_date}</div>
              </div>
              <div className="payroll-meta">
                <span className="net-pay">${entry.net_pay.toFixed(2)}</span>
                <span className="status-badge">Paid</span>
              </div>
            </div>

            {expandedId === entry.id && (
              <div className="payroll-details">
                <div className="payroll-columns">
                  <div>
                    <h4 className="text-base font-semibold text-green-700 mb-2">
                      Earnings
                    </h4>
                    <ul>
                      <li>Base Salary: ${entry.base_salary.toFixed(2)}</li>
                      <li>Overtime: ${entry.overtime.toFixed(2)}</li>
                      <li>Bonus: ${entry.bonus.toFixed(2)}</li>
                      <li>Commission: ${entry.commission.toFixed(2)}</li>
                      <li className="bold">
                        Gross Pay: ${entry.gross_pay.toFixed(2)}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-red-600 mb-2">
                      Deductions
                    </h4>
                    <ul>
                      <li>Total Deductions: -${entry.deductions.toFixed(2)}</li>
                      <li className="bold">
                        Net Pay: ${entry.net_pay.toFixed(2)}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
