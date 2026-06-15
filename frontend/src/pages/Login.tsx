import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/demo');
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to demo login');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Sign in to your account</h3>
      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Email address" 
          type="email" 
          required 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <Input 
          label="Password" 
          type="password" 
          required 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        
        <Button type="submit" className="w-full" isLoading={loading}>
          Sign in
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span>
          </div>
        </div>

        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleDemoLogin} 
            isLoading={demoLoading}
          >
            Demo Account Login
          </Button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
