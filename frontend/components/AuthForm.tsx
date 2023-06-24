'use client';

import { FormEvent, useEffect, useState } from 'react';
import { setToken, setUser } from '../app/store/slices/authSlice';
import { store } from '../app/store/store';
import styles from '../styles/AuthForm.module.scss';
import classNames from 'classnames';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { UserDTO } from '@/utils/types';

const AuthForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [authType, setAuthType] = useState<'Sign Up' | 'Sign In'>('Sign Up');
  const [userDTO, setUserDTO] = useState<UserDTO>({ login: '', password: '' });
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('token');
    store.dispatch(setToken(null));
    store.dispatch(setUser(null));
  }, []);

  const toggleAuthType = () => {
    setAuthType(authType === 'Sign Up' ? 'Sign In' : 'Sign Up');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/${authType === 'Sign Up' ? 'signUp' : 'signIn'}`,
        userDTO
      );

      const { token, ...user } = response.data;

      store.dispatch(setToken(token));
      store.dispatch(setUser(user));

      localStorage.setItem('token', token);
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response.data.message ?? err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>{authType}</h2>
      <input
        value={userDTO.login}
        onChange={(e) => setUserDTO((prev) => ({ ...prev, login: e.target.value }))}
        className={styles.input}
        type='string'
        placeholder='Login'
        required
        minLength={3}
      />
      <input
        onChange={(e) => setUserDTO((prev) => ({ ...prev, password: e.target.value }))}
        value={userDTO.password}
        className={styles.input}
        type='password'
        placeholder='Password'
        required
        minLength={6}
      />
      {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
      <button className={classNames('button', styles.button, styles['button__high-contrast'])}>{authType}</button>
      <button type='button' onClick={toggleAuthType} className={classNames('button', styles.button)}>
        {authType === 'Sign Up' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default AuthForm;
