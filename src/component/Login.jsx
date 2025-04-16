import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLoginUserMutation } from '../redux/features/bankApi';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password
      }).unwrap();
      
      if (response) {
        toast.success("Login successful");
        navigate('/dashboard'); // Redirect on successful login
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.', {
        icon: <AlertCircle className="text-red-500" size={16} />
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-800 text-white overflow-y-auto">
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#4c1d95',
            fontWeight: 500,
            borderRadius: '10px',
            padding: '16px'
          }
        }}
      />
      
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Logo or App Name */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tighter">Owo</h1>
          <p className="text-white/70 mt-1">Your trusted financial partner</p>
        </div>
        
        {/* Form Container */}
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit(onSubmit)} className="p-8">
              <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
              <p className="text-white/70 text-sm mb-6">Sign in to access your account</p>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Email Address</label>
                  <div className="relative group">
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address format"
                        }
                      })}
                      type="email"
                      className={`w-full bg-white/5 border ${errors.email ? 'border-red-400' : 'border-white/20'} 
                               rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all
                               group-hover:border-white/30`}
                      placeholder="you@example.com"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-hover:text-white/70 transition-colors" />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium">Password</label>
                    <a href="/forgot-password" className="text-white/70 hover:text-white text-sm transition-colors">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative group">
                    <input
                      {...register("password", {
                        required: "Password is required"
                      })}
                      type={showPassword ? "text" : "password"}
                      className={`w-full bg-white/5 border ${errors.password ? 'border-red-400' : 'border-white/20'} 
                               rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all
                               group-hover:border-white/30`}
                      placeholder="Enter your password"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-hover:text-white/70 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <div className={`w-5 h-5 rounded border ${rememberMe ? 'bg-white border-white' : 'border-white/30 bg-white/5'} flex items-center justify-center transition-colors`}>
                        {rememberMe && <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>}
                      </div>
                    </div>
                    <span className="text-sm text-white/80">Remember me</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-purple-700 font-semibold py-3 px-6 rounded-xl 
                           flex items-center justify-center space-x-2 hover:bg-white/90 transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Sign Up Section */}
            <div className="py-4 bg-white/5 border-t border-white/10 px-8">
              <div className="flex items-center justify-center space-x-1">
                <span className="text-white/70">Don't have an account?</span>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-white font-medium hover:text-white/80 transition-colors ml-1"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
          
          {/* Security Notice */}
          <div className="mt-6 flex items-center justify-center">
            <Lock size={16} className="text-white/60 mr-2" />
            <p className="text-xs text-white/60 text-center">
              Your login is protected with end-to-end encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;