import { useEffect, useState } from 'react';
import { getPayrollDatesForEmployee } from '../SupabaseFunction/RetievePayrollHistory';
import PayrollInfo from '../components/payroll';

type PayrollRecord = {
  payrollid: number;
  payroll_approved_date: string;
};

export default function PayrollHistory() {
  const [employeeID] = useState<number>(
    Number(localStorage.getItem('employeeID') || '0')
  );
  const [history, setHistory] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayroll, setSelectedPayroll] = useState<number | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPayrollDatesForEmployee(employeeID);
        setHistory(data ?? []);
      } catch (err) {
        console.error(err);
        setError('Failed to load payroll history.');
      } finally {
        setLoading(false);
      }
    };

    if (employeeID) fetchHistory();
  }, [employeeID]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
            <div className="w-20 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No payroll records found</h3>
      <p className="text-gray-500 max-w-sm mx-auto">Your payroll history will appear here once records are available for your account.</p>
    </div>
  );

  const ErrorState = () => (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center">
        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-red-900 mb-2">Unable to load payroll history</h3>
      <p className="text-red-600 mb-6">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Try Again
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Payroll History</h1>
          </div>
          <p className="text-gray-600 text-lg">Review and access your complete payroll records</p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8">
              <LoadingSkeleton />
            </div>
          ) : error ? (
            <ErrorState />
          ) : history.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-1">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</span>
                    </div>
                    <div className="col-span-4">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Payroll Period</span>
                    </div>
                    <div className="col-span-3">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Payroll ID</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Approved</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</span>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {history.map((record, index) => (
                    <div
                      key={record.payrollid}
                      className="px-8 py-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer group"
                      onClick={() => setSelectedPayroll(record.payrollid)}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-sm"></div>
                          </div>
                        </div>
                        <div className="col-span-4">
                          <div className="font-semibold text-gray-900 text-lg mb-1">
                            {formatDate(record.payroll_approved_date)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Pay Period #{index + 1}
                          </div>
                        </div>
                        <div className="col-span-3">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                            #{record.payrollid}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            Approved
                          </div>
                        </div>
                        <div className="col-span-2 text-right">
                          <button className="inline-flex items-center px-4 py-2 bg-white border-2 border-gray-200 text-sm font-semibold rounded-xl text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group-hover:border-blue-400">
                            View Details
                            <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {history.map((record, index) => (
                  <div
                    key={record.payrollid}
                    className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedPayroll(record.payrollid)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Approved
                        </div>
                      </div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        #{record.payrollid}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {formatDate(record.payroll_approved_date)}
                      </h3>
                      <p className="text-sm text-gray-500">Pay Period #{index + 1}</p>
                    </div>

                    <div className="flex justify-end">
                      <button className="inline-flex items-center px-4 py-2 bg-white border-2 border-gray-200 text-sm font-semibold rounded-xl text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                        View Details
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedPayroll !== null && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setSelectedPayroll(null)}
            ></div>
            
            {/* Modal */}
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Payroll Details</h2>
                    <p className="text-blue-100 text-sm">Payroll ID: #{selectedPayroll}</p>
                  </div>
                  <button
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
                    onClick={() => setSelectedPayroll(null)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
                <PayrollInfo payroll_id_click={selectedPayroll} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}