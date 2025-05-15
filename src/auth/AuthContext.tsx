import { createContext, useContext, useState } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => void
  logout: () => void
  userEmail: string | null
  userPassword: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 3. Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const [userPassword, setUserPassword] = useState<string>('')
  
  const login = (email: string, password: string) => {
    setIsAuthenticated(true)
    setUserEmail(email)
    setUserPassword(password)
  }
  const logout = () => {
    setIsAuthenticated(false)
    setUserEmail('')
    setUserPassword('')
  }
  
  const value = { 
    isAuthenticated, 
    login, 
    logout,
    userEmail,
    userPassword,
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}