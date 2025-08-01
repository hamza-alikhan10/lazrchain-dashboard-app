import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isSignup: boolean;
  isLoggedIn: boolean;
  userEmail: string;
  userId: string; 
}

const initialState: AuthState = {
  isSignup: false,
  isLoggedIn: false,
  userEmail: '',
  userId: '', 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsSignup: (state, action: PayloadAction<boolean>) => {
      state.isSignup = action.payload;
    },
    setLogin: (
      state,
      action: PayloadAction<{ email: string; userId: string }>
    ) => {
      state.isLoggedIn = true;
      state.userEmail = action.payload.email;
      state.userId = action.payload.userId; 
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userEmail = '';
      state.userId = '';
    },
    setUseremail: (state, action: PayloadAction<string>) => {
      state.userEmail = action.payload;
    },
  },
});


export const { setIsSignup, setLogin, logout, setUseremail } = authSlice.actions;
export default authSlice.reducer;
