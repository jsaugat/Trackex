import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  userInfo: any | null;
  token: string | null;
}

const initialState: AuthState = {
  userInfo: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<any>) => {
      // Destructure token out of the payload if it exists
      const { token, ...user } = action.payload;
      if (token) {
        state.token = token;
      }
      // Depending on the payload, if it doesn't have a token, we don't overwrite the existing one here
      state.userInfo = { ...state.userInfo, ...user };
    },
    setUserInfo: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
    },
    clearCredentials: (state) => {
      state.userInfo = null;
      state.token = null;
    },
  },
});

export const { setCredentials, setUserInfo, clearCredentials } =
  authSlice.actions;
export default authSlice.reducer;
