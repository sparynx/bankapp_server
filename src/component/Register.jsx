import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowRight, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useRegisterUserMutation } from '../redux/features/bankApi';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  });

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const onSubmit = async (data) => {
    try {
      const response = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      }).unwrap();
      
      // Successful registration
      if (response) {
        navigate('/login'); // Redirect to login page
      }
    } catch (error) {
      // Handle error cases
      console.error('Registration failed:', error);
    }
  };

  const nextStep = () => {
    const currentValues = getValues();
    if (step === 1 && currentValues.email && currentValues.password) {
      setStep(2);
    } else if (step === 2 && currentValues.firstName && currentValues.lastName) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white overflow-y-auto">
      <div className="flex min-h-screen justify-center items-center px-4 py-12">
        {/* Main Card Container */}
        <div className="w-full max-w-md bg-black/20 backdrop-blur-xl rounded-3xl p-1 shadow-2xl">
          <div className="bg-black/30 rounded-3xl overflow-hidden">
            {/* Brand Header */}
            <div className="py-6 px-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight">FinTech Pro</h1>
              <p className="text-white/70 text-sm mt-1">Future of banking starts here</p>
            </div>

            {/* Progress Indicator */}
            <div className="w-full px-8 mb-6 flex justify-between relative">
              <div className="absolute top-1/2 left-8 right-8 h-1 bg-white/10 -translate-y-1/2 rounded-full" />
              <div className="absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 -translate-y-1/2 rounded-full" 
                style={{ width: `${step === 1 ? '0%' : '100%'}` }} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 
                        ${step >= 1 ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/10 text-white'}`}>
                <span className="text-sm font-bold">1</span>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 
                        ${step >= 2 ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/10 text-white'}`}>
                <span className="text-sm font-bold">2</span>
              </div>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8">
              <h2 className="text-xl font-bold mb-6">
                {step === 1 ? "Create Your Account" : "Personal Information"}
              </h2>

              {step === 1 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">Email Address</label>
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
                                rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all`}
                        placeholder="Enter your email"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">Password</label>
                    <div className="relative">
                      <input
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters"
                          }
                        })}
                        type={showPassword ? "text" : "password"}
                        className={`w-full bg-white/5 border ${errors.password ? 'border-red-400' : 'border-white/10'} 
                                rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all`}
                        placeholder="Create password"
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                    )}
                    <p className="text-white/50 text-xs">Password must be at least 8 characters</p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">First Name</label>
                    <div className="relative">
                      <input
                        {...register("firstName", {
                          required: "First name is required"
                        })}
                        type="text"
                        className={`w-full bg-white/5 border ${errors.firstName ? 'border-red-400' : 'border-white/10'} 
                                rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all`}
                        placeholder="Enter your first name"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">Last Name</label>
                    <div className="relative">
                      <input
                        {...register("lastName", {
                          required: "Last name is required"
                        })}
                        type="text"
                        className={`w-full bg-white/5 border ${errors.lastName ? 'border-red-400' : 'border-white/10'} 
                                rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all`}
                        placeholder="Enter your last name"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 space-y-4">
                <button
                  type={step === 2 ? "submit" : "button"}
                  onClick={step === 1 ? nextStep : undefined}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium py-4 px-6 rounded-xl 
                          flex items-center justify-center space-x-2 hover:from-cyan-500 hover:to-blue-600 transition-all
                          shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isLoading ? "Creating Account..." : step === 1 ? "Continue" : "Create Account"}</span>
                  <ArrowRight size={20} className="animate-pulse" />
                </button>
                
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full bg-white/5 backdrop-blur-sm text-white font-medium py-4 px-6 rounded-xl 
                            hover:bg-white/10 transition-colors border border-white/10"
                  >
                    Back
                  </button>
                )}
              </div>
            </form>

            {/* Terms and Privacy */}
            <div className="px-8 pb-8 text-center">
              <p className="text-sm text-white/50">
                By creating an account, you agree to our <a href="#" className="text-cyan-400 hover:text-cyan-300">Terms of Service</a> and <a href="#" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;