import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import {io} from 'socket.io-client'


const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://chat-application-adw0.onrender.com"
axios.defaults.baseURL= backendUrl

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [authUser, setAuthUser] = useState(null)
  const [onlineUser, setOnlineUser] = useState([])
  const [socket, setSocket] = useState(null)

  console.log('Backend URL:', axios.defaults.baseURL)
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const checkAuth = async () => {
    try {
      const { data } = await axios.get('/api/auth/check')
      if (data.success) {
        setAuthUser(data.user)
        connectSocket(data.user)
      }
    } catch (error) {
      console.log('Auth check failed:', error.response?.data || error.message)
    }
  }

  const signUp = async (body) => {
    try {
      const { data } = await axios.post('/api/auth/signup', body)
      if (data.success) {
        toast.success(data.message || 'Signup completed successfully')
      }
      return data
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Signup failed')
      return { success: false, message: error.response?.data?.message || error.message }
    }
  }

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials)
      if (data.success) {
        setAuthUser(data.userData)
        connectSocket(data.userData)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        setToken(data.token)
        localStorage.setItem('token', data.token)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Login failed')
    }
  }

  const logout = async () => {
    localStorage.removeItem('token')
    setToken(null)
    setAuthUser(null)
    setOnlineUser([])
    axios.defaults.headers.common['Authorization'] = null
    toast.success('Logged out Successfully')
    socket?.disconnect()
  }

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put('/api/auth/update-Profile', body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (data.success) {
        setAuthUser(data.user)
        toast.success('profile update successfully')
      }
    } catch (error) {
      console.log('Update profile error:', error.response?.data || error.message)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    })
    newSocket.connect()
    setSocket(newSocket)

    newSocket.on('getOnline Users', (userIds) => {
      setOnlineUser(userIds)
    })
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      checkAuth()
    }
  }, [token])

  const value = {
    axios,
    authUser,
    onlineUser,
    socket,
    login,
    logout,
    signUp,
    updateProfile,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}