import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  username?: string;
  id?: number;
  loggedIn: boolean;
}

const initialState: AuthState = {
  loggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.loggedIn = false;
    },
    login: (state, action: PayloadAction<{ username: string; id: number }>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.loggedIn = true;
    },
  },
  //   selectors: {
  //     isLoggedIn: (state) => state.loggedIn,
  //   },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
