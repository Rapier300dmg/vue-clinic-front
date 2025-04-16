import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

export async function login(email, password) {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password })
    return res.data  
  } catch (error) {
    throw error.response?.data?.message || error
  }
}
