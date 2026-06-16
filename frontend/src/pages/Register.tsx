import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    currency: 'USD'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/register', formData);
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Create an account</h3>
      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" name="firstName" required value={formData.firstName} onChange={handleChange} />
          <Input label="Last Name" name="lastName" required value={formData.lastName} onChange={handleChange} />
        </div>
        <Input label="Email address" type="email" name="email" required value={formData.email} onChange={handleChange} />
        <Input label="Password" type="password" name="password" required value={formData.password} onChange={handleChange} />
        
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Currency</label>
          <select 
            name="currency" 
            value={formData.currency} 
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="USD" className="dark:bg-gray-900">USD ($)</option>
            <option value="EUR" className="dark:bg-gray-900">EUR (€)</option>
            <option value="GBP" className="dark:bg-gray-900">GBP (£)</option>
            <option value="INR" className="dark:bg-gray-900">INR (₹)</option>
          </select>
        </div>

        <Button type="submit" className="w-full" isLoading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
