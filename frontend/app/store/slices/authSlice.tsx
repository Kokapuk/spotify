'use client';

import { User } from '@/utils/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface AuthState {
  token: string | null | undefined;
  user: User | null | undefined;
}

const initialState: AuthState = {
  token: undefined,
  user: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, { payload: token }: PayloadAction<string | null>) => {
      state.token = token;

      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
    },
    setUser: (state, { payload: user }: PayloadAction<User | null>) => {
      state.user = user;
    },
  },
});

export const { setToken, setUser } = authSlice.actions;
export default authSlice.reducer;
