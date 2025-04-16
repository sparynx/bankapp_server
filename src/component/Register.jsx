import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, Check, ChevronLeft } from 'lucide-react';
import { useRegisterUserMutation } from '../redux/features/bankApi';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { register, handleSubmit, formState: { errors, isValid }, getValues, watch } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
    mode: 'onChange'
  });

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  // Watch password to check strength
  const password = watch('password');
  
  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    
    setPasswordStrength(score);
  }, [password]);

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
    if (step === 1 && currentValues.email && currentValues.password && !errors.email && !errors.password) {
      setStep(2);
    } else if (step === 2 && currentValues.firstName && currentValues.lastName) {
      handleSubmit(onSubmit)();
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-800 text-white overflow-y-auto">
      <div className="flex flex-col items-center px-4 py-8 min-h-screen justify-center">
        {/* Logo or App Name */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tighter">SecureBank</h1>
          <p className="text-white/70 mt-1">Your trusted financial partner</p>
        </div>
        
        {/* Form Container */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20">
          {/* Form Header */}
          <div className="p-6 pb-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                {step === 2 && (
                  <button 
                    onClick={() => setStep(1)}
                    className="mr-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <h1 className="text-2xl font-bold">
                  {step === 1 ? "Create Account" : "Personal Details"}
                </h1>
              </div>
              <div className="flex">
                <div className={`w-3 h-3 rounded-full mr-2 ${step >= 1 ? 'bg-white' : 'bg-white/30'}`}></div>
                <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-6">
              {step === 1 ? "Set up your login credentials" : "Tell us about yourself"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 pt-2">
            {step === 1 && (
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
                    {!errors.email && getValues('email') && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Password</label>
                  <div className="relative group">
                    <input
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters"
                        }
                      })}
                      type={showPassword ? "text" : "password"}
                      className={`w-full bg-white/5 border ${errors.password ? 'border-red-400' : 'border-white/20'} 
                               rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all
                               group-hover:border-white/30`}
                      placeholder="Create a secure password"
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
                    <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                  )}
                  
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getStrengthColor()} transition-all`}
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                        <span className="text-xs ml-2 text-white/70">{getStrengthText()}</span>
                      </div>
                      <ul className="text-xs text-white/70 space-y-1 pl-4">
                        <li className={password.length >= 8 ? 'text-green-400' : ''}>• At least 8 characters</li>
                        <li className={/[A-Z]/.test(password) ? 'text-green-400' : ''}>• At least 1 uppercase letter</li>
                        <li className={/[0-9]/.test(password) ? 'text-green-400' : ''}>• At least 1 number</li>
                        <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-400' : ''}>• At least 1 special character</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">First Name</label>
                    <div className="relative group">
                      <input
                        {...register("firstName", {
                          required: "First name is required"
                        })}
                        type="text"
                        className={`w-full bg-white/5 border ${errors.firstName ? 'border-red-400' : 'border-white/20'} 
                                 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all
                                 group-hover:border-white/30`}
                        placeholder="John"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-hover:text-white/70 transition-colors" />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Last Name</label>
                    <div className="relative group">
                      <input
                        {...register("lastName", {
                          required: "Last name is required"
                        })}
                        type="text"
                        className={`w-full bg-white/5 border ${errors.lastName ? 'border-red-400' : 'border-white/20'} 
                                 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all
                                 group-hover:border-white/30`}
                        placeholder="Doe"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-hover:text-white/70 transition-colors" />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center mt-4">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="h-4 w-4 bg-white/5 border-white/20 rounded focus:ring-white/30"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-white/70">
                    I agree to the <a href="#" className="text-white hover:underline">Terms of Service</a> and <a href="#" className="text-white hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                type={step === 2 ? "submit" : "button"}
                onClick={step === 1 ? nextStep : undefined}
                disabled={isLoading || (step === 1 && (!getValues('email') || !getValues('password') || errors.email || errors.password))}
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
                    Creating Account...
                  </span>
                ) : (
                  <>
                    <span>{step === 1 ? "Continue" : "Create Account"}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
              
              <div className="text-center">
                <span className="text-white/70 text-sm">Already have an account? </span>
                <a href="/login" className="text-white font-medium hover:underline text-sm">Sign in</a>
              </div>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-8 flex items-center justify-center max-w-sm">
          <Lock size={16} className="text-white/60 mr-2" />
          <p className="text-xs text-white/60 text-center">
            Your information is secured with end-to-end encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;