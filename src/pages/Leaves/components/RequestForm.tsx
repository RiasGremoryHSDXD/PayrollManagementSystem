import React, { useState } from 'react'
import '../css/RequestForm.css'
import ErrorToast from './ErrorToast'

export default function RequestForm() {
    const [formData, setFormData] = useState({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [startDateError, setStartDateError] = useState<boolean>(false);
    const [endDateError, setEndDateError] = useState<boolean>(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reset error states
        setStartDateError(false);
        setEndDateError(false);
        
        if(!isStartDateValid()) {
            setStartDateError(true);
            return;
        }
        
        if(!isEndDateValid()) {
            setEndDateError(true);
            return;
        }
        
        // Show success message instead of alert
        setShowSuccessMessage(true);
        
        // Hide the form after successful submission (optional)
        // setIsVisible(false);
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    const closeSuccessMessage = () => {
        setShowSuccessMessage(false);
        setIsVisible(false);
    };

    const isStartDateValid = () => {
        const start = new Date(formData.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time part for accurate comparison
        return start >= today;
    };

    const isEndDateValid = () => {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        return end >= start;
    };
    
    const clearStartDateError = () => {
        setStartDateError(false);
    };
    
    const clearEndDateError = () => {
        setEndDateError(false);
    };

    if (!isVisible) {
        return null; // Don't render anything if the form is closed
    }

    return (
        <>
            <div className='bg-[#95b1f0] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-fit p-3 rounded-lg shadow-lg'>

                <form className='request-form-container' onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold text-gray-800">Leave Request Form</h2>

                    <label className="flex flex-col text-gray-700 text-sm">
                        <span className="mb-1 font-medium">Leave Type</span>
                        <select
                            name="leaveType"
                            value={formData.leaveType}
                            required
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="" disabled>
                                — Select Type —
                            </option>
                            <option value="Vacation">Vacation</option>
                            <option value="Sick Leave">Sick Leave</option>
                            <option value="Personal">Personal</option>
                        </select>
                    </label>
                    
                    <div>
                        <label className="flex flex-col text-gray-700 text-sm">
                            <span className="mb-1 font-medium">Start Date</span>
                            <input
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                type="date" 
                                name="startDate" 
                                value={formData.startDate} 
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>

                    <div>
                        <label className="flex flex-col text-gray-700 text-sm">
                            <span className="mb-1 font-medium">End Date</span>
                            <input
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                type="date" 
                                name="endDate" 
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>

                    <div>
                        <label className="flex flex-col text-gray-700 text-sm">
                            <span className="mb-1 font-medium">Reason</span>
                            <textarea          
                                className="p-3 h-32 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder='Please provide a reason for your leave'
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button 
                            type="button"
                            onClick={handleClose}
                            className='bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out'
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className='bg-[#4f6dff] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#3b5eff] transition duration-300 ease-in-out'
                        >
                            Submit
                        </button>
                    </div>
                </form>

                {startDateError && (
                    <ErrorToast 
                        message="Invalid Start Date: must be today or later." 
                        onClose={clearStartDateError}
                    />
                )}
                
                {endDateError && (
                    <ErrorToast 
                        message="Invalid End Date: must be after start date." 
                        onClose={clearEndDateError}
                    />
                )}
            </div>

            {/* Success message popup */}
            {showSuccessMessage && (
                <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-100 w-[280px] h-fit p-6 rounded-lg shadow-lg border-2 border-green-500 z-50'>
                    
                    <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        
                        <h1 className="text-xl font-bold text-green-800 mb-2">Success!</h1>
                        <p className="text-green-700 text-center">
                            Your leave request has been successfully submitted.
                        </p>
                        
                        <button 
                            onClick={closeSuccessMessage}
                            className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}