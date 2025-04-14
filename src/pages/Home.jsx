import React from 'react';
import { ShieldCheck, Smartphone, ArrowRight, Send, CreditCard, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

let a = 7;
let b = 4;

let result = a ^ b;
console.log(result); 

const ThemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
      className="absolute top-6 right-6 z-10 bg-white/20 backdrop-blur-lg text-white hover:bg-white/30 transition-all"
    >
      {computedColorScheme === 'light' ? (
        <IconMoon stroke={1.5} />
      ) : (
        <IconSun stroke={1.5} />
      )}
    </ActionIcon>
  );
};

const Home = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-800 via-violet-700 to-indigo-800 text-white overflow-y-auto">
      {/* Abstract shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute top-3/4 left-1/3 w-48 h-48 rounded-full bg-fuchsia-500/10 blur-3xl"></div>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Main Container */}
      <div className="relative flex flex-col items-center px-6 max-w-6xl mx-auto h-full pb-24">
        {/* Header */}
        <header className="w-full py-8 text-center">
          <h1 className="text-5xl font-bold mb-2 tracking-tight">
            <span className="text-amber-400">Ọ</span>wọ́
          </h1>
          <p className="text-lg opacity-90 mb-4 max-w-md mx-auto">
            Modern financial solutions with a Yoruba touch
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-amber-300 rounded mx-auto"></div>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mt-8 mb-16">
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Banking <span className="text-amber-400">reimagined</span> for the digital age
            </h2>
            <p className="text-white/80 mb-8 max-w-md">
              Experience seamless financial management with a perfect blend of cultural heritage and cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register" className="bg-gradient-to-r from-amber-400 to-amber-500 text-purple-900 font-semibold py-4 px-8 rounded-xl flex items-center justify-center hover:opacity-90 transition-all shadow-lg hover:shadow-amber-500/20">
                <span>Start Now</span>
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link to="/login" className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium py-4 px-8 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all">
                Sign In
              </Link>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative w-full max-w-xs">
            <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-3 shadow-2xl border border-purple-500/30">
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-700 rounded-full"></div>
              <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl overflow-hidden">
                <div className="pt-10 pb-6 px-6">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-amber-400 text-lg font-bold">Ọwọ́</p>
                      <p className="text-xs text-white/60">Main Account</p>
                    </div>
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <CreditCard size={18} className="text-amber-400" />
                    </div>
                  </div>
                  <p className="text-white/60 text-xs mb-1">Balance</p>
                  <p className="text-3xl font-bold mb-6">₦42,500<span className="text-xs text-white/60">.00</span></p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white/10 rounded-xl p-3 flex flex-col items-center">
                      <div className="w-8 h-8 bg-amber-400/20 rounded-full flex items-center justify-center mb-1">
                        <Send size={14} className="text-amber-400" />
                      </div>
                      <span className="text-xs">Send</span>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 flex flex-col items-center">
                      <div className="w-8 h-8 bg-amber-400/20 rounded-full flex items-center justify-center mb-1">
                        <CreditCard size={14} className="text-amber-400" />
                      </div>
                      <span className="text-xs">Pay</span>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 flex flex-col items-center">
                      <div className="w-8 h-8 bg-amber-400/20 rounded-full flex items-center justify-center mb-1">
                        <TrendingUp size={14} className="text-amber-400" />
                      </div>
                      <span className="text-xs">Invest</span>
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm px-6 py-4 rounded-b-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full mr-3 flex items-center justify-center">
                        <Zap size={16} className="text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium">Quick Transfer</p>
                        <p className="text-xs text-white/60">Send money instantly</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-white/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -right-4 top-1/4 bg-white/10 backdrop-blur-lg border border-white/20 p-3 rounded-2xl shadow-lg">
              <Smartphone size={24} className="text-amber-400" />
            </div>
            <div className="absolute -left-4 bottom-1/4 bg-white/10 backdrop-blur-lg border border-white/20 p-3 rounded-2xl shadow-lg">
              <ShieldCheck size={24} className="text-amber-400" />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="w-full max-w-4xl mb-12">
          <h3 className="text-2xl font-bold mb-8 text-center">Why Choose <span className="text-amber-400">Ọwọ́</span></h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all group">
              <div className="w-12 h-12 bg-amber-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-400/30 transition-all">
                <ShieldCheck size={24} className="text-amber-400" />
              </div>
              <h4 className="font-semibold mb-2">Secure Banking</h4>
              <p className="text-sm text-white/70">
                Bank with confidence using our state-of-the-art security features and encryption
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all group">
              <div className="w-12 h-12 bg-amber-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-400/30 transition-all">
                <Send size={24} className="text-amber-400" />
              </div>
              <h4 className="font-semibold mb-2">Instant Transfers</h4>
              <p className="text-sm text-white/70">
                Send and receive money instantly with zero fees across all Nigerian banks
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all group">
              <div className="w-12 h-12 bg-amber-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-400/30 transition-all">
                <TrendingUp size={24} className="text-amber-400" />
              </div>
              <h4 className="font-semibold mb-2">Smart Investments</h4>
              <p className="text-sm text-white/70">
                Grow your wealth with custom investment plans tailored to your financial goals
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-4xl mb-16">
          <div className="bg-gradient-to-r from-purple-900/60 to-indigo-800/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to experience modern banking?</h3>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              Join thousands of satisfied customers who have transformed their financial experience with Ọwọ́
            </p>
            <Link to="/register" className="inline-flex items-center justify-center bg-gradient-to-r from-amber-400 to-amber-500 text-purple-900 font-semibold py-4 px-8 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-amber-500/20">
              <span>Create Free Account</span>
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full text-center text-white/60 text-sm mt-auto pb-6">
          <p>© 2025 Ọwọ́. All rights reserved.</p>
          <p className="mt-2">Powered by Sparynx Technologies</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;