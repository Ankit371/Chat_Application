import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import {io} from 'socket.io-client'


const backendUrl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL= backendUrl

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{

        const [token , setToken] = useState(localStorage.getItem("token"))
        const [authUser, setAuthUser] = useState(null)
        const [onlineUser, setOnlineUser] = useState([])
        const [socket, setSocket] = useState(null)

          // Axios base config
  axios.defaults.baseURL = "http://localhost:5000";  // backend ka base URL
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }


            // check if user is authenticated and if so , set the user data and connect the socket  
            
        const checkAuth = async () => {
            try {
                const {data} =  await axios.get("/api/auth/check")
                    if(data.success){
                        setAuthUser(data.user)
                        connectSocket(data.user)
                    }

            } catch (error) {
                toast.error(error.message)
            }
        }

// Login function to handle user authentication and socket connection 

    const login = async (state,credentials) => {
        try {
            const {data} = await axios.post(`/api/auth/${state}`,credentials)
                if(data.success){
                    setAuthUser(data.userData)
                    connectSocket(data.userData)
                    axios.defaults.headers.common["token"] = data.token
                    setToken(data.token)

                    localStorage.setItem("token",data.token)
                    toast.success(data.message)
                }
                else{
                    toast.error(data.message)
                }

        } catch (error) {
            toast.error(error.message)
        }
    }

// Logout function to handle user logout and socket disconnection 
const logout = async () => {
    localStorage.removeItem("token")
    setToken(null)
    setAuthUser(null)
    setOnlineUser([])
    axios.defaults.headers.common["token"] = null
    toast.success("Logged out Successfully")
    socket.disconnect();
}

// Update profile function to handle user profile updates 

    const updateProfile = async (body) => {
        try {


                 console.log("Current token:", axios.defaults.headers.common["token"]);

            const {data} = await axios.put("/api/auth/update-Profile", body,
                {
                    headers:{
                        token:token
                    }
                }
            )

    //               const { data } = await axios.put(
    //   "http://localhost:5000/api/auth/update-profile",
    //   body,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //          // 👈 yaha Bearer + token bhejna zaroori hai
    //     },
    //   }
    // );



            if(data.success){
                setAuthUser(data.user);
                toast.success("profile update successfully")
            }
        } catch (error) {
                    console.log("Update profile error:", error.response?.data || error.message);

            toast.error(error.message)
        }
    }
 
// connect socket function to handle socket connection and online Users updates

            const connectSocket = (userData)=>{
                if(!userData || socket?.connected) return 
                const newSocket = io(backendUrl,{
                    query:{
                        userId: userData._id,

                    }
                })
                newSocket.connect()
                setSocket(newSocket)

                newSocket.on("getOnline Users",(userIds)=>{
                    setOnlineUser(userIds)
                })
            }

        useEffect(()=>{
            if(token){
                axios.defaults.headers.common["token"] = token 
            }
        },[])


            const value = {
                    axios ,
                    authUser, 
                    onlineUser,
                    socket,
                    login,
                    logout, 
                    updateProfile,
                    checkAuth

            }
            return (
                <AuthContext.Provider value={value}>
                    {children}
                </AuthContext.Provider>
            )
}