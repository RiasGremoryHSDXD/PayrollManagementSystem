import React, { useState, useEffect } from 'react';
import '../css/RequestForm.css';
import ErrorToast from './ErrorToast';
import { useAuth } from '../../../auth/AuthContext';
import { employee_details } from '../SupabaseFunction/EmployeeDetails';
import { insertLeaveWithDetails } from '../SupabaseFunction/AddLeaveDB';

export default function RequestForm() {
  const { userEmail, userPassword } = useAuth();

  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);
  const [overlapError, setOverlapError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Employee info
  const [employeeInfo, setEmployeeInfo] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const result = await employee_details(userEmail, userPassword);
      setEmployeeInfo(result?.[0] ?? null);
    })();
  }, [userEmail, userPassword]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const leaveTypeMap: Record<string, number> = {
    'Vacation': 1,
    'Sick Leave': 2,
    'Personal': 3,
  };

  const isStartDateValid = () => {
    const start = new Date(formData.startDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    return start >= today;
  };

  const isEndDateValid = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return end >= start;
  };

  const getDaysBetween = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    const diffMs = end.getTime() - start.getTime();
    return Math.floor(diffMs / (1000*60*60*24)) + 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStartDateError(false);
    setEndDateError(false);
    setOverlapError(null);

    if (!isStartDateValid()) {
      setStartDateError(true);
      return;
    }
    if (!isEndDateValid()) {
      setEndDateError(true);
      return;
    }
    if (!employeeInfo) {
      setOverlapError('Employee information not available.');
      return;
    }

    const days = getDaysBetween();
    try {
      await insertLeaveWithDetails(
        formData.startDate,
        formData.endDate,
        days,
        formData.reason,
        'Pending',
        employeeInfo.managerid,
        null,
        null,
        leaveTypeMap[formData.leaveType] ?? 0,
        employeeInfo.employeescheduled
      );
      setShowSuccessMessage(true);
    } catch (err: any) {
      // err.message contains the exact exception text from your PL/pgSQL function
      const msg = err.message || '';

      if (msg.includes('attendance records for today')) {
        // This is our new attendance‐conflict exception
        setOverlapError(msg);
      } else if (msg.includes('already have a leave')) {
        // Existing leave‐overlap exception
        setOverlapError(msg);
      } else {
        setOverlapError('Unexpected error. Please try again later.');
      }
      console.error('Insert error:', err);
    }
  };

  const handleClose = () => setIsVisible(false);
  const closeSuccessMessage = () => {
    setShowSuccessMessage(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className='bg-[#95b1f0] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-fit p-3 rounded-lg shadow-lg'>
        <form className='request-form-container' onSubmit={handleSubmit}>
          <h2 className='text-2xl font-bold text-gray-800'>Leave Request Form</h2>

          <label className='flex flex-col text-gray-700 text-sm'>
            <span className='mb-1 font-medium'>Leave Type</span>
            <select
              name='leaveType'
              value={formData.leaveType}
              required
              onChange={handleChange}
              className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            >
              <option value='' disabled>— Select Type —</option>
              <option value='Vacation'>Vacation</option>
              <option value='Sick Leave'>Sick Leave</option>
              <option value='Personal'>Personal</option>
            </select>
          </label>

          <label className='flex flex-col text-gray-700 text-sm mt-3'>
            <span className='mb-1 font-medium'>Start Date</span>
            <input
              type='date'
              name='startDate'
              value={formData.startDate}
              onChange={handleChange}
              required
              className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </label>

          <label className='flex flex-col text-gray-700 text-sm mt-3'>
            <span className='mb-1 font-medium'>End Date</span>
            <input
              type='date'
              name='endDate'
              value={formData.endDate}
              onChange={handleChange}
              required
              className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </label>

          <label className='flex flex-col text-gray-700 text-sm mt-3'>
            <span className='mb-1 font-medium'>Reason</span>
            <textarea
              name='reason'
              value={formData.reason}
              onChange={handleChange}
              required
              placeholder='Please provide a reason for your leave'
              className='p-3 h-32 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </label>

          <div className='flex justify-between mt-4'>
            <button
              type='button'
              onClick={handleClose}
              className='bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600'
            >Cancel</button>
            <button
              type='submit'
              className='bg-[#4f6dff] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#3b5eff]'
            >Submit</button>
          </div>
        </form>

        {startDateError && (
          <ErrorToast
            message='Invalid Start Date: must be today or later.'
            onClose={() => setStartDateError(false)}
          />
        )}
        {endDateError && (
          <ErrorToast
            message='Invalid End Date: must be after start date.'
            onClose={() => setEndDateError(false)}
          />
        )}
        {overlapError && (
          <ErrorToast
            message={overlapError}
            onClose={() => setOverlapError(null)}
          />
        )}
      </div>

      {showSuccessMessage && (
        <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-100 w-[280px] h-fit p-6 rounded-lg shadow-lg border-2 border-green-500 z-50'>
          <div className='flex flex-col items-center'>
            <svg className='w-16 h-16 text-green-500 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <h1 className='text-xl font-bold text-green-800 mb-2'>Success!</h1>
            <p className='text-green-700 text-center'>
              Your leave request has been successfully submitted.
            </p>
            <button
              onClick={closeSuccessMessage}
              className='mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600'
            >Close</button>
          </div>
        </div>
      )}
    </>
  );
}
