'use client';

import jwt from 'jsonwebtoken';
import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { setToken, setUser } from './slices/authSlice';
import { store } from './store';
import { User } from '@/utils/types';

interface Props {
  children: ReactNode;
}

const ReduxProvider = ({ children }: Props) => {
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      store.dispatch(setUser(null));
      store.dispatch(setToken(null));
      return;
    }

    const decoded = jwt.decode(token) as User;

    if (!decoded) {
      store.dispatch(setUser(null));
      store.dispatch(setToken(null));
      return;
    }

    store.dispatch(setToken(token));
    store.dispatch(setUser({ _id: decoded._id, login: decoded.login }));
  }, []);

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
