import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    loading:false,
    signUpData:null,
    isAuthenticated:false,
    isSessionChecked:false,
}

const authSlice =createSlice({
    name:"auth",
    initialState: initialState,
    reducers:{
        setSignupData(state, value) {
            state.signUpData = value.payload;
          },
          setLoading(state, value) {
            state.loading = value.payload;
          },
          setAuthenticated(state,value){
            state.isAuthenticated=value.payload
          },
          setSessionChecked(state,value){
            state.isSessionChecked=value.payload
          }
    }
});

export const {setAuthenticated,setSessionChecked,setLoading,setSignupData}=authSlice.actions;
export default authSlice.reducer;