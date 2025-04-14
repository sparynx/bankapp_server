import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowRight, Mail, Lock, User, Smartphone, Eye, EyeOff } from 'lucide-react';
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
    <div className="fixed inset-0 bg-gradient-to-b from-purple-600 to-blue-700 text-white overflow-y-auto">
      <div className="flex flex-col items-center px-4 py-8">
        {/* Progress Indicator */}
        <div className="w-full max-w-sm mb-8 flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/20 -translate-y-1/2" />
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/80 -translate-y-1/2" 
               style={{ width: `${(step - 1) * 100}%` }} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                        ${step >= 1 ? 'bg-white text-purple-600' : 'bg-white/20 text-white'}`}>1</div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                        ${step >= 2 ? 'bg-white text-purple-600' : 'bg-white/20 text-white'}`}>2</div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm bg-white/10 rounded-2xl p-6 backdrop-blur-lg">
          <h1 className="text-2xl font-bold mb-6">
            {step === 1 ? "Create Your Account" : "Personal Information"}
          </h1>

          {step === 1 && (
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
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters"
                      }
                    })}
                    type={showPassword ? "text" : "password"}
                    className={`w-full bg-white/5 border ${errors.password ? 'border-red-400' : 'border-white/10'} 
                             rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-white/30 transition-colors`}
                    placeholder="Create password"
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
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">First Name</label>
                <div className="relative">
                  <input
                    {...register("firstName", {
                      required: "First name is required"
                    })}
                    type="text"
                    className={`w-full bg-white/5 border ${errors.firstName ? 'border-red-400' : 'border-white/10'} 
                             rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-white/30 transition-colors`}
                    placeholder="Enter your first name"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                </div>
                {errors.firstName && (
                  <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Last Name</label>
                <div className="relative">
                  <input
                    {...register("lastName", {
                      required: "Last name is required"
                    })}
                    type="text"
                    className={`w-full bg-white/5 border ${errors.lastName ? 'border-red-400' : 'border-white/10'} 
                             rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-white/30 transition-colors`}
                    placeholder="Enter your last name"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
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
              className="w-full bg-white text-purple-600 font-semibold py-4 px-6 rounded-xl 
                       flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? "Creating Account..." : step === 1 ? "Continue" : "Create Account"}</span>
              <ArrowRight size={20} />
            </button>
            
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full bg-white/10 text-white font-semibold py-4 px-6 rounded-xl 
                         hover:bg-white/20 transition-colors"
              >
                Back
              </button>
            )}
          </div>
        </form>

        {/* Terms and Privacy */}
        <p className="mt-6 text-sm text-white/60 text-center max-w-sm">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Register;