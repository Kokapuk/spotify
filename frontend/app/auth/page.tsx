import AuthForm from '@/components/AuthForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Log in to Spotify.',
};

const Auth = () => {
  return <AuthForm />;
};

export default Auth;
