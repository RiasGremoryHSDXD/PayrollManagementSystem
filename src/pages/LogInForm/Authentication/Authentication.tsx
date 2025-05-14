// src/lib/auth.js
import supabase from '../../../config/SupabaseClient'

export async function user_authentication(email:string, password:string) {
  const { data, error } = await supabase
    .rpc('user_authentication', {
      inputted_username: email,
      inputted_password: password
    })                            

  if (error) {
    console.error('RPC error:', error)   
    return null
  }

  return data                          
}
