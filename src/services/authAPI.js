import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../slices/authSlice"
import { resetCart } from "../slices/cartSlice"
import { setUser } from "../slices/profileSlice"
import { endpoints } from "../services/apis"
import {apiConnector} from "../services/apiconnector"
// import {setProgress} from "../slices/loadingBarSlice"


const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      // dispatch(setProgress(100));
      console.log("SENDOTP API RESPONSE............", response)

      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error(error?.response?.data?.message)
      navigate("/signup")
      // dispatch(setProgress(100));
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        toast.dismiss(toastId)
        throw new Error(response.data.message)
        
      }
      // dispatch(setProgress(100));
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      // dispatch(setProgress(100));
      console.log("SIGNUP API ERROR............", error)
      toast.error(error.response.data.message)
      navigate('/signup')
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        toast.dismiss(toastId)
        navigate("/login")
        window.location.reload(false);
        throw new Error(response.data.message)
        
      }
      // dispatch(setProgress(100))
      toast.success("Login Successful")
      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))
      localStorage.setItem("user", JSON.stringify(response.data.user))
      localStorage.setItem("token", JSON.stringify(response.data.token))
      navigate("/dashboard/my-profile")
    } catch (error) {
      // dispatch(setProgress(100))
      toast.dismiss(toastId)
      console.log("LOGIN API ERROR............", error)
      toast.error(error.response.data.message)
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function getPasswordResetToken(email,setEmailSent){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{ 
            const response =await apiConnector("POST",RESETPASSTOKEN_API,{email})
            console.log("Reset Password token Response.....", response)
            if(!response.data.success)
            {
              throw new Error(response.data.message);
            }
            toast.success("Reset Email Sent");
            setEmailSent(true);
        }
        catch(error){
            console.log("Reset Password Token Error");

        }
        dispatch(setLoading(false));

    }
}

export function resetPassword(password,confirmPassword,token){
  return async(dispatch)=>{
    dispatch(setLoading(true));
    try{
      const response =await apiConnector("POST",RESETPASSWORD_API,{password,confirmPassword,token});

      console.log("Reset Password Token Response..",response);
      if(!response.data.success)
            {
              throw new Error(response.data.message);
            }
            toast.success("Password has been reset successfully");
            

    }
    catch(error){
      console.log("Unable to reset password ");

    }
    dispatch(setLoading(false));
  }
}

export function logout(navigate){
  return async(dispatch)=>{
    const toastId = toast.loading("Logging Out")
    try{
      dispatch(setUser(null ))
      localStorage.setItem("user", null)
      localStorage.setItem("token",null)
      toast.success("Log Out Successful")
      navigate("/")
      window.location.reload(false);
    }
    catch(error){
      console.log("logout ERROR............", error)
      toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
  }

}