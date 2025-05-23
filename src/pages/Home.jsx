import React from 'react';
import { ShieldCheck, Smartphone, ArrowRight, Send, CreditCard, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900 text-white overflow-y-auto">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative flex flex-col items-center px-6 max-w-6xl mx-auto h-full pb-16 pt-10">
        {/* Logo */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <span className="text-blue-400 mr-1">Ọ</span><span>wọ́</span>
          </h1>
        </div>

        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mb-20">
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Financial freedom in the <span className="text-blue-400">digital age</span>
            </h2>
            <p className="text-white/80 mb-8 max-w-md">
              Experience seamless banking, payments, and financial management with cutting-edge technology and world-class security.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register" className="bg-blue-500 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-all">
                <span>Open an Account</span>
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link to="/login" className="bg-white/10 border border-white/10 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center hover:bg-white/15 transition-all">
                Sign In
              </Link>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative w-full max-w-xs">
            <div className="bg-black/70 backdrop-blur-xl rounded-3xl p-3 shadow-xl border border-white/10">
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-700 rounded-full"></div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
                <div className="pt-10 pb-6 px-6">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-blue-400 text-lg font-bold">Ọwọ́</p>
                      <p className="text-xs text-white/60">Main Account</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <CreditCard size={18} className="text-blue-400" />
                    </div>
                  </div>
                  <p className="text-white/60 text-xs mb-1">Balance</p>
                  <p className="text-3xl font-bold mb-6">NGN 24,350<span className="text-xs text-white/60">.75</span></p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center mb-1">
                        <Send size={14} className="text-blue-400" />
                      </div>
                      <span className="text-xs">Send</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center mb-1">
                        <CreditCard size={14} className="text-blue-400" />
                      </div>
                      <span className="text-xs">Pay</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center mb-1">
                        <TrendingUp size={14} className="text-blue-400" />
                      </div>
                      <span className="text-xs">Invest</span>
                    </div>
                  </div>
                </div>
                <div className="bg-black/20 px-6 py-4 rounded-b-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-full mr-3 flex items-center justify-center">
                        <Zap size={16} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium">Quick Actions</p>
                        <p className="text-xs text-white/60">Transfers & payments</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -right-4 top-1/4 bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-lg">
              <Smartphone size={24} className="text-blue-400" />
            </div>
            <div className="absolute -left-4 bottom-1/4 bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-lg">
              <ShieldCheck size={24} className="text-blue-400" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-4xl mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-3">Key Features</h3>
            <p className="text-white/60 max-w-lg mx-auto">
              Banking reimagined for the modern world
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/15 transition-all">
                <ShieldCheck size={24} className="text-blue-400" />
              </div>
              <h4 className="font-medium mb-2">Enterprise Security</h4>
              <p className="text-sm text-white/70">
                Bank-grade encryption and multi-factor authentication to keep your finances secure
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/15 transition-all">
                <Send size={24} className="text-blue-400" />
              </div>
              <h4 className="font-medium mb-2">Global Transfers</h4>
              <p className="text-sm text-white/70">
                Send and receive money globally with competitive exchange rates and minimal fees
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/15 transition-all">
                <TrendingUp size={24} className="text-blue-400" />
              </div>
              <h4 className="font-medium mb-2">Smart Investments</h4>
              <p className="text-sm text-white/70">
                AI-powered investment options that adapt to your financial goals and risk tolerance
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-4xl mb-20">
          <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 backdrop-blur-md border border-white/5 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to experience modern banking?</h3>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              Join the financial revolution with Ọwọ́
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register" className="bg-blue-500 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-all">
                <span>Create Free Account</span>
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full text-center text-white/60 text-sm mt-auto pt-6 border-t border-white/10 mb-6">
          <p>© 2025 Ọwọ́. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;