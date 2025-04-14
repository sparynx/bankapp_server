import React, { useState } from 'react';
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, ShieldCheck, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  
  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };
  
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900 text-white overflow-y-auto">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="w-full py-6 flex items-center justify-between px-6 max-w-6xl mx-auto">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            <span className="text-blue-400 mr-1">Ọ</span><span>wọ́</span>
          </h1>
        </Link>
        <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors">
          Already have an account? <span className="text-blue-400">Sign In</span>
        </Link>
      </header>

      {/* Main Container */}
      <div className="flex min-h-screen justify-center items-center px-4 pt-12 pb-24">
        {/* Card Container */}
        <div className="w-full max-w-md">
          {/* Back to homepage on mobile */}
          <Link to="/" className="md:hidden flex items-center text-white/70 mb-6 hover:text-white transition-colors">
            <ChevronLeft size={16} className="mr-1" />
            <span>Back to homepage</span>
          </Link>

          {/* Progress Indicator */}
          <div className="w-full mb-8 flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2 rounded-full"></div>
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 -translate-y-1/2 rounded-full transition-all" 
              style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
            
            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all
                      ${step >= 1 ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/10 text-white'}`}>
              <span className="text-sm font-bold">1</span>
            </div>
            
            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all
                      ${step >= 2 ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/10 text-white'}`}>
              <span className="text-sm font-bold">2</span>
            </div>
            
            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all
                      ${step >= 3 ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/10 text-white'}`}>
              <span className="text-sm font-bold">3</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden">
            {/* Security badge */}
            <div className="absolute -right-2 top-4 md:top-6 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-l-xl shadow-lg flex items-center">
              <ShieldCheck size={16} className="text-blue-400 mr-2" />
              <span className="text-xs text-white/80">Secure Registration</span>
            </div>

            <div className="p-6 md:p-8">
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
                  <p className="text-white/60 text-sm mb-6">Start your journey to financial freedom with Ọwọ́</p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/80">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 transition-all"
                          placeholder="Enter your email"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/80">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 transition-all"
                          placeholder="Create a secure password"
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
                      <p className="text-white/50 text-xs">Password must be at least 8 characters with numbers and symbols</p>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
                  <p className="text-white/60 text-sm mb-6">Tell us a bit about yourself</p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/80">First Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 transition-all"
                          placeholder="Enter your first name"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/80">Last Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 transition-all"
                          placeholder="Enter your last name"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-2xl font-bold mb-2">Mobile Verification</h2>
                  <p className="text-white/60 text-sm mb-6">Secure your account with a verified phone number</p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/80">Phone Number</label>
                      <div className="relative">
                        <input
                          type="tel"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 transition-all"
                          placeholder="+234 800 000 0000"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
                      </div>
                      <p className="text-white/50 text-xs">We&apos;ll send a verification code to this number</p>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 space-y-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-medium py-4 px-6 rounded-xl 
                          flex items-center justify-center space-x-2 hover:from-blue-500 hover:to-indigo-600 transition-all
                          shadow-lg shadow-blue-500/30"
                >
                  <span>{step === 3 ? "Complete Registration" : "Continue"}</span>
                  <ArrowRight size={20} className="animate-pulse" />
                </button>
                
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full bg-white/5 backdrop-blur-sm text-white font-medium py-4 px-6 rounded-xl 
                            hover:bg-white/10 transition-colors border border-white/10"
                  >
                    Back
                  </button>
                )}
              </div>
            </div>

            {/* Features highlight */}
            <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 backdrop-blur-sm p-6 border-t border-white/10">
              <p className="text-sm font-medium mb-3">Join Ọwọ́ and get access to:</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center text-white/80 text-xs">
                  <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center mr-2">
                    <ShieldCheck size={12} className="text-blue-400" />
                  </div>
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center text-white/80 text-xs">
                  <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center mr-2">
                    <ShieldCheck size={12} className="text-blue-400" />
                  </div>
                  <span>Global Transfers</span>
                </div>
                <div className="flex items-center text-white/80 text-xs">
                  <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center mr-2">
                    <ShieldCheck size={12} className="text-blue-400" />
                  </div>
                  <span>Smart Investments</span>
                </div>
                <div className="flex items-center text-white/80 text-xs">
                  <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center mr-2">
                    <ShieldCheck size={12} className="text-blue-400" />
                  </div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Privacy */}
          <p className="mt-6 text-sm text-white/60 text-center">
            By creating an account, you agree to our <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;