import '../css/DashBoardHeader.css'
import { useState, useEffect } from "react";
import { useAuth } from '../../../../auth/AuthContext';
import { employee_details } from '../../../Leaves/EmployeeDetail/EmployeeDetails';

export default function DashBoardHeader(){
    const [time] = useState<Date>(new Date());
    const [employeeName, setEmployeeName] = useState<string>("")
    const [employeePosition, setEmployeePosition] = useState<string>("")
    
    
    const { userEmail, userPassword } = useAuth();

    useEffect(() => {
    getEmployeeName();
    }, []);

    const getEmployeeName = async () => {
    try {
        const result = await employee_details(userEmail, userPassword);
        if (result && result.length > 0) {
        setEmployeeName(result[0].employeename);
        setEmployeePosition(result[0].employeeposition)
        }
    } catch (error) {
        console.error("Error fetching employee details:", error);
    }
    }

    // const { userEmail, userPassword } = useAuth()
    const formattedDate = time.toLocaleDateString("en-PH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }); 

    return(
            <header className="header-area">
                <div className="dashboard">
                    <h1>Dashboard</h1>
                    <p>{formattedDate}</p>
                </div>
                
                <div className="profile">
                    <img
                    src="public/person_icon.svg"
                    alt="person_icon"
                    className="w-[20px] h-[20px] m-5 hover:to-blue-700"
                    />
                    <div className="profile-name">
                        {employeeName}
                    <p className=" font-medium text-gray-800 text-sm">
                    </p>
                    <p className="text-gray-600 text-sm">{employeePosition}</p>
                    </div>
                </div>
        </header>
    )
}