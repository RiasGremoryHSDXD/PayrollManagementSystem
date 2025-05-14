import Leave from '../../Leaves/index.tsx'
import { useAuth } from '../../../auth/AuthContext.tsx'

export default function index() {
  
  const { userEmail, userPassword } = useAuth()

  console.log("Employee Dashboard")
  console.log("User Email: ", userEmail)
  console.log("User Password: ", userPassword)
  return (
    <div>
      <Leave/>
    </div>
  )
}
