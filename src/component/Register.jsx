import React, { useState } from 'react';
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, ChevronLeft, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation, useLoginUserMutation } from '../redux/features/bankApi';

// Login Component
export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password
      }).unwrap();
      
      if (response) {
        navigate('/dashboard'); // Redirect to dashboard on successful login
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900 text-white overflow-y-auto">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>

      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12">
        {/* Back to home link */}
        <Link to="/" className="absolute top-6 left-6 flex items-center text-white/70 hover:text-white transition-colors">
          <ChevronLeft size={20} className="mr-1" />
          <span>Back to Home</span>
        </Link>

        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center">
            <span className="text-blue-400 mr-1">Ọ</span><span>wọ́</span>
          </h1>
          <p className="text-white/60 mt-2">Sign in to your account</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg">
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
                           rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-400/50 transition-colors`}
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required"
                  })}
                  type={showPassword ? "text" : "password"}
                  className={`w-full bg-white/5 border ${errors.password ? 'border-red-400' : 'border-white/10'} 
                           rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-400/50 transition-colors`}
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 bg-white/5 border border-white/10 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-white/80">
                Remember me for 30 days
              </label>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-blue-500 text-white font-medium py-3 px-4 rounded-lg 
                     flex items-center justify-center space-x-2 hover:bg-blue-400 transition-colors
                     disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? "Signing in..." : "Sign In"}</span>
            <ArrowRight size={18} />
          </button>

          {/* Security Note */}
          <div className="flex items-center justify-center mt-6 text-white/50 text-xs">
            <ShieldCheck size={14} className="mr-1" />
            <span>Your connection is secure</span>
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-center">
          <span className="text-white/60">Don't have an account?</span>{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

// Register Component
export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, getValues, watch } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch("password");
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const onSubmit = async (data) => {
    try {
      const response = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      }).unwrap();
      
      if (response) {
        navigate('/login'); // Redirect to login page on successful registration
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const nextStep = () => {
    const currentValues = getValues();
    if (step === 1 && 
        currentValues.email && 
        !errors.email && 
        currentValues.password && 
        !errors.password && 
        currentValues.confirmPassword && 
        !errors.confirmPassword) {
      setStep(2);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900 text-white overflow-y-auto">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>

      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12">
        {/* Back to home link */}
        <Link to="/" className="absolute top-6 left-6 flex items-center text-white/70 hover:text-white transition-colors">
          <ChevronLeft size={20} className="mr-1" />
          <span>Back to Home</span>
        </Link>

        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center">
            <span className="text-blue-400 mr-1">Ọ</span><span>wọ́</span>
          </h1>
          <p className="text-white/60 mt-2">Create your account</p>
        </div>

        {/* Progress Indicator */}
        <div className="w-full max-w-sm mb-6 flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2" />
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-400 -translate-y-1/2" 
               style={{ width: step === 1 ? '0%' : '100%' }} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                         ${step >= 1 ? 'bg-blue-400 text-indigo-900' : 'bg-white/20 text-white'}`}>1</div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                         ${step >= 2 ? 'bg-blue-400 text-indigo-900' : 'bg-white/20 text-white'}`}>2</div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-medium mb-6">
            {step === 1 ? "Account Credentials" : "Personal Information"}
          </h2>

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
                             rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-400/50 transition-colors`}
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
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: "Password must include uppercase, lowercase, number and special character"
                      }
                    })}
                    type={showPassword ? "text" : "password"}
                    className={`w-full bg-white/5 border ${errors.password ? 'border-red-400' : 'border-white/10'} 
                             rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-400/50 transition-colors`}
                    placeholder="Create password"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <input
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: value => value === password || "Passwords do not match"
                    })}
                    type={showPassword ? "text" : "password"}
                    className={`w-full bg-white/5 border ${errors.confirmPassword ? 'border-red-400' : 'border-white/10'} 
                             rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-400/50 transition-colors`}
                    placeholder="Confirm password"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
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
                             rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-400/50 transition-colors`}
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
                             rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-400/50 transition-colors`}
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

          {/* Password Requirements Hint */}
          {step === 1 && (
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-white/60 mb-2">Password requirements:</p>
              <ul className="text-xs text-white/60 space-y-1">
                <li className="flex items-center">
                  <div className="w-1 h-1 bg-white/40 rounded-full mr-2"></div>
                  <span>At least 8 characters</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1 h-1 bg-white/40 rounded-full mr-2"></div>
                  <span>Must include uppercase and lowercase letters</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1 h-1 bg-white/40 rounded-full mr-2"></div>
                  <span>At least one number and special character</span>
                </li>
              </ul>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 space-y-3">
            {step === 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-blue-500 text-white font-medium py-3 px-4 rounded-lg 
                         flex items-center justify-center space-x-2 hover:bg-blue-400 transition-colors"
              >
                <span>Continue</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white font-medium py-3 px-4 rounded-lg 
                         flex items-center justify-center space-x-2 hover:bg-blue-400 transition-colors
                         disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
                <ArrowRight size={18} />
              </button>
            )}
            
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full bg-white/5 border border-white/10 text-white font-medium py-3 px-4 rounded-lg 
                         hover:bg-white/10 transition-colors"
              >
                Back
              </button>
            )}
          </div>

          {/* Security Note */}
          <div className="flex items-center justify-center mt-6 text-white/50 text-xs">
            <ShieldCheck size={14} className="mr-1" />
            <span>Your connection is secure</span>
          </div>
        </form>

        {/* Sign In Link */}
        <p className="mt-6 text-center">
          <span className="text-white/60">Already have an account?</span>{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in
          </Link>
        </p>

        {/* Terms and Privacy */}
        <p className="mt-4 text-sm text-white/60 text-center max-w-sm">
          By creating an account, you agree to our <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default { Login, Register };