import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLoginUserMutation } from '../redux/features/bankApi';
import toast, { Toaster } from 'react-hot-toast';

const notify = () => toast.error('Login failed. Please try again.');
const success = () => toast.success("successful login")

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password
      }).unwrap();
      
      if (response) {
        success();
        navigate('/dashboard'); // Redirect on successful login
      }
    } catch (error) {
      console.error('Login failed:', error);
      notify(); // Show toast notification on error
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-600 to-blue-700 text-white overflow-y-auto">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="flex flex-col items-center px-4 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm bg-white/10 rounded-2xl p-6 backdrop-blur-lg">
          <h1 className="text-2xl font-bold mb-6">Welcome Back</h1>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email Address</label>
              <div className="relative">
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  type="email"
                  className={`w-full bg-white/5 border ${errors.email ? 'border-red-400' : 'border-white/10'} 
                           rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-white/30 transition-colors`}
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required"
                  })}
                  type={showPassword ? "text" : "password"}
                  className={`w-full bg-white/5 border ${errors.password ? 'border-red-400' : 'border-white/10'} 
                           rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-white/30 transition-colors`}
                  placeholder="Enter password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm">Remember me</span>
              </label>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-purple-600 font-semibold py-4 px-6 rounded-xl 
                       flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? "Signing In..." : "Sign In"}</span>
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="mt-6 text-center">
            <span className="text-white/60">Don't have an account? </span>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-white font-semibold hover:text-white/80 transition-colors"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
