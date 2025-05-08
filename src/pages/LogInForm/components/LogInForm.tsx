// src/components/LogInForm.jsx
import { useState } from 'react'
import { authenticateUser } from '../Authentication/Authentication'
import '../css/LogInForm.css'

export default function LogInForm() {
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleSubmit = async (e:any) => 
    {
        e.preventDefault()
        const result = await authenticateUser(userEmail, userPassword)  

        if (result > 0) 
        {
        setIsAuthenticated(true)
        setErrorMsg('')
        } 
        else 
        {
        setErrorMsg('Invalid credentials')                            
        }
    }

  if (isAuthenticated) 
  {
    return <div>🎉 Welcome back!</div>
  }

  return (
    <form className="login-form-container" onSubmit={handleSubmit}>
      
      <input
        type="email"
        placeholder="Email"
        value={userEmail}
        onChange={e => setUserEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={userPassword}
        onChange={e => setUserPassword(e.target.value)}
      />

      <button type="submit">Log In</button>
      {errorMsg && errorMsg}
    </form>
  )
}
