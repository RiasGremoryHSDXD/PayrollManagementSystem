// src/lib/auth.js
import supabase from '../../../config/SupabaseClient'

export async function authenticateUser(email:string, password:string) {
  const { data, error } = await supabase
    .rpc('user_auth', {
      user_email_input: email,
      user_password_input: password
    })                            

  if (error) {
    console.error('RPC error:', error)   
    return null
  }

  return data                          
}
