import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ children } : any) {
  const { isAuthenticated } = useAuth()

  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Otherwise render the protected component
  return children
}
