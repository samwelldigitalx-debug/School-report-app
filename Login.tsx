import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button, Input, Card } from './ui';
import { auth } from '@/src/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

interface LoginProps {}

export const Login = ({}: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg mb-6">
            <GraduationCap className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">EduResult Nigeria</h1>
          <p className="mt-2 text-gray-600 font-medium">Professional School Result Management</p>
        </div>

        <Card className="p-8 shadow-xl border-0">
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail size={18} />}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={<Lock size={18} />}
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full py-6 text-lg" isLoading={isLoading}>
              Sign In <ArrowRight className="ml-2" size={20} />
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="px-4 bg-white text-gray-500 font-bold tracking-wider">Or continue with</span>
            </div>
          </div>

          <div className="mt-8">
            <Button 
              variant="outline" 
              className="w-full py-6 border-2 hover:bg-gray-50"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-3" />
              Sign in with Google
            </Button>
          </div>
        </Card>

        <p className="text-center text-sm text-gray-500">
          Don't have an account? <a href="#" className="text-blue-600 font-bold hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
};
