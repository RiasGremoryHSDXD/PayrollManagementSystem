import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { user_authentication } from "../Authentication/Authentication";
import { useAuth } from "../../../auth/AuthContext";
import "../css/LogInForm.css";
import { EmployeeDetails } from "../EmployeeDetails/EmployeeDetails";

export default function LogInForm() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [saveCredentials, setSaveCredentials] = useState<boolean>(true);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    async function loadDeatails() {
      const storedUserName = localStorage.getItem("username");
      const storedPassword = localStorage.getItem("password");

      if (storedUserName && storedPassword) {
        login(storedUserName, storedPassword);
        await EmployeeDetails().catch(console.error);
        const employee_position = localStorage.getItem("employeePosition");
        if (employee_position === "Manager") {
          navigate("/dashboardManager");
        } else {
          navigate("/dashboardEmployee");
        }
      } else {
        setSaveCredentials(false);
      }
    }

    loadDeatails();
  }, []);

  if (saveCredentials) {
    return null;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setShowError(true);

    if (!userEmail || !userPassword) {
      setErrorMsg("Please fill in the field");
      return;
    }
    const result = await user_authentication(userEmail, userPassword);

    if (result > 0) {
      login(userEmail, userPassword);
      localStorage.setItem("username", userEmail);
      localStorage.setItem("password", userPassword);
      await EmployeeDetails().catch(console.error);
      const employee_position = localStorage.getItem("employeePosition");
      if (employee_position === "Manager") {
        navigate("/dashboardManager");
      } else {
        navigate("/dashboardEmployee");
      }
    } else {
      setErrorMsg("Invalid credentials. Please check your email and password");
    }
  };

  return (
    <form className="login-form-container" onSubmit={handleSubmit}>
      <div className="header-container">
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>egghead</title>
          <path
            d="M11.998 0c-1.649 0-3.223.893-4.679 2.655-.934 1.134-1.818 2.638-2.567 4.368-1.338.207-2.399.48-3.143.814a2.04 2.04 0 0 0-1.21 
            1.93c.041 1.433.385 2.925.64 3.924.22.868.95 1.512 1.838 1.623v.018A9.121 9.121 0 0 0 11.997 24l-.003-.001a9.133 9.133 0 0 0 9.127-8.667v-.016a2.175 
            2.175 0 0 0 1.84-1.626c.255-.997.599-2.489.64-3.93a2.036 2.036 0 0 0-1.21-1.926c-.765-.34-1.825-.616-3.154-.816-.748-1.727-1.634-3.228-2.565-4.361C15.22.894 13.647 
            0 11.998 0zm-.008.828c1.412 0 2.786.797 4.084 2.37.948 1.15 1.844 2.71 2.585 4.512 1.206.163 2.448.413 3.33.806.491.217.8.71.784 1.245-.038 1.346-.371 2.785-.61 3.738a1.458 1.458 
            0 0 1-1.397 1.104h-.014c-.146 0-.291-.01-.437-.013a8.443 8.443 0 0 1-.558 3.29 8.335 8.335 0 0 1-7.763 5.287h-.002v-.001A8.344 8.344 0 0 1 4.23 17.88a8.446 8.446 
            0 0 1-.573-3.288c-.14.003-.278.013-.418.013h-.007a1.458 1.458 0 0 1-1.395-1.104c-.248-.955-.577-2.386-.616-3.73a1.325 1.325 0 0 1 .784-1.252c.837-.371 2.075-.63 3.313-.803C6.066 5.914 6.96 4.352 
            7.906 3.2 9.204 1.625 10.578.828 11.99.828zm0 .77a3.365 3.365 0 0 0-1.691.492c-1.831 1.058-3.25 3.558-4.108 5.528 1.096-.118 2.137-.181 2.788-.172.54-.005 1.06.21 1.44.594A3.868 3.868 0 0 1 12 
            7.674a3.867 3.867 0 0 1 1.582.365 1.994 1.994 0 0 1 1.427-.593c.43-.007 1.535.036 2.776.162-.852-1.958-2.273-4.461-4.104-5.518a3.374 3.374 0 0 0-1.692-.491zm3.215 7.045v.004a.922.922 0 0 
            0-.93.774c-.099.53-.164 1.064-.196 1.601-.007.614.214 1.034.651 1.25 1.252.558 2.66.898 4.27 1.034-.189-1.377-.578-2.958-1.112-4.495-1.087-.122-2.12-.177-2.683-.168zm-6.422.001a25.896 25.896 
            0 0 0-2.644.159c-.533 1.54-.924 3.123-1.108 4.5 1.59-.14 2.983-.48 4.226-1.034.44-.214.66-.636.653-1.252a12.746 12.746 0 0 0-.198-1.6.92.92 0 0 
            0-.93-.773zM5.29 8.91c-.624.09-1.242.21-1.79.364l1.509.533c.087-.299.183-.598.281-.897zm13.453.01c.096.29.188.581.274.872l1.46-.515a14.497 14.497 0 0 0-1.734-.357zm-6.746.34a.859.859 
            0 0 0-.478.144c-.303.2-.408.581-.378.868.122 1.139.07 2.388-1.229 3.01l-.015.008a11.37 11.37 0 0 1-1.93.707c-1.162.308-2.351.5-3.548.573a7.574 7.574 0 0 0 14.627 3.007 7.584 7.584 
            0 0 0 .506-3.009 18.16 18.16 0 0 1-3.525-.572c-.664-.175-1.31-.41-1.931-.7l-.014-.012c-1.303-.623-1.352-1.871-1.23-3.01.03-.287-.075-.668-.378-.87a.859.859 0 0 0-.477-.145zm-9.352 
            1.875c.113.726.271 1.422.407 1.95.044.17.196.29.37.29.289-.001.554-.024.83-.037.075-.612.197-1.27.35-1.95a203.22 203.22 0 0 1-1.957-.253zm18.695 0c-.746.099-1.506.198-1.909.246.155.683.275 
            1.344.352 1.96.26.01.508.034.778.036a.385.385 0 0 0 .37-.289c.136-.53.296-1.226.409-1.953Z"
          />
        </svg>
        <h2 className="mt-4 md:mt-[16px] text-xl md:text-2xl font-bold font-[Helvetica Neue]">
          Enterprise Portal
        </h2>
        <p className="mt-2 md:mt-[8px] text-sm md:text-base  text-gray-600 font-[Segoe UI]">
          Log in to access your account
        </p>

        {showError && errorMsg && (
          <div
            className=" mt-3 md:mt-[12px] 
              w-full max-w-[95vw] md:max-w-[400px] 
              mx-auto border border-red-200 bg-red-50 
              text-red-600 text-xs md:text-sm 
              rounded-md py-3 px-4 relative"
          >
            <button
              onClick={() => setErrorMsg("")}
              className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-700 hover: cursor-pointer"
              aria-label="Close error message"
            >
              <svg
                className="w-3 h-3 md:w-4 md:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="pr-4">{errorMsg}</div>
          </div>
        )}
      </div>

      <div className="input-container">
        <div className="email-container">
          <label
            htmlFor="Email"
            className="block font-[Helvetica Neue] text-sm md:text-base mb-1 text-gray-800 font-semibold font-sans"
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="Name@example.com"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>
        <div className="pass-container">
          <label
            htmlFor="Password"
            className="font-[Helvetica Neue] text-sm text-gray-800 font-semibold font-sans"
          >
            Password{" "}
          </label>
          <input
            type="password"
            placeholder="••••••"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="footer-container">
        <button type="submit" onClick={() => setErrorMsg("")}>
          Log In
        </button>
      </div>
    </form>
  );
}
