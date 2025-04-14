import React from 'react';
import { ShieldCheck, Smartphone, ArrowRight, Send, CreditCard, TrendingUp, Zap, ChevronRight } from 'lucide-react';
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
      size="lg"
      aria-label="Toggle color scheme"
      className="absolute top-6 right-6 z-10 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/10 rounded-full"
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
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900 text-white overflow-y-auto">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Main Container */}
      <div className="relative flex flex-col items-center px-6 max-w-6xl mx-auto h-full pb-16">
        {/* Header/Navigation */}
        <header className="w-full py-6 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight flex items-center">
              <span className="text-blue-400 mr-1">Ọ</span><span>wọ́</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">Features</a>
            <a href="#security" className="text-sm text-white/70 hover:text-white transition-colors">Security</a>
            <a href="#about" className="text-sm text-white/70 hover:text-white transition-colors">About</a>
            <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="bg-blue-500 hover:bg-blue-400 text-white text-sm py-2 px-4 rounded-lg transition-colors">
              Get Started
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mt-16 mb-24">
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
              <Link to="/learn-more" className="bg-white/10 border border-white/10 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center hover:bg-white/15 transition-all">
                Learn More
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
                    <ChevronRight size={16} className="text-white/60" />
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
        <section id="features" className="w-full max-w-4xl mb-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-3">Why Choose Ọwọ́</h3>
            <p className="text-white/60 max-w-lg mx-auto">
              We've reimagined banking from the ground up to provide you with the best possible experience
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

          <div className="mt-12 pt-12 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-md border border-white/5 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                    <CreditCard size={20} className="text-blue-400" />
                  </div>
                  <h4 className="font-medium">Virtual Cards</h4>
                </div>
                <p className="text-sm text-white/70 mb-4">
                  Create unlimited virtual debit cards for online purchases with customizable spending limits and instant freeze options.
                </p>
                <Link to="/virtual-cards" className="inline-flex items-center text-blue-400 text-sm hover:text-blue-300">
                  Learn more <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-md border border-white/5 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                    <Zap size={20} className="text-blue-400" />
                  </div>
                  <h4 className="font-medium">Instant Notifications</h4>
                </div>
                <p className="text-sm text-white/70 mb-4">
                  Real-time transaction alerts and spending insights keep you informed and in control of your finances.
                </p>
                <Link to="/notifications" className="inline-flex items-center text-blue-400 text-sm hover:text-blue-300">
                  Learn more <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-4xl mb-24">
          <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 backdrop-blur-md border border-white/5 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to experience modern banking?</h3>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              Join thousands of satisfied customers who have transformed their financial experience with Ọwọ́
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register" className="bg-blue-500 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-all">
                <span>Create Free Account</span>
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link to="/demo" className="bg-white/10 border border-white/10 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center hover:bg-white/15 transition-all">
                Watch Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full max-w-4xl mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
            <div className="text-center px-6 py-4 border-b md:border-b-0 md:border-r border-white/10">
              <p className="text-4xl font-bold text-blue-400 mb-2">1.4M+</p>
              <p className="text-sm text-white/60">Active users worldwide</p>
            </div>
            <div className="text-center px-6 py-4 border-b md:border-b-0 md:border-r border-white/10">
              <p className="text-4xl font-bold text-blue-400 mb-2">99.99%</p>
              <p className="text-sm text-white/60">Uptime reliability</p>
            </div>
            <div className="text-center px-6 py-4">
              <p className="text-4xl font-bold text-blue-400 mb-2">$2.8B</p>
              <p className="text-sm text-white/60">Monthly transaction volume</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full text-center text-white/60 text-sm mt-auto pb-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-6 md:mb-0">
              <p className="text-lg font-bold mb-2 flex items-center justify-center md:justify-start">
                <span className="text-blue-400 mr-1">Ọ</span><span className="text-white">wọ́</span>
              </p>
              <p className="text-xs text-white/60">The future of digital banking</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-xs uppercase text-white/40 mb-3">Product</p>
                <ul className="space-y-2">
                  <li><a href="#" className="text-xs hover:text-white">Features</a></li>
                  <li><a href="#" className="text-xs hover:text-white">Security</a></li>
                  <li><a href="#" className="text-xs hover:text-white">Pricing</a></li>
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase text-white/40 mb-3">Company</p>
                <ul className="space-y-2">
                  <li><a href="#" className="text-xs hover:text-white">About</a></li>
                  <li><a href="#" className="text-xs hover:text-white">Careers</a></li>
                  <li><a href="#" className="text-xs hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase text-white/40 mb-3">Legal</p>
                <ul className="space-y-2">
                  <li><a href="#" className="text-xs hover:text-white">Privacy</a></li>
                  <li><a href="#" className="text-xs hover:text-white">Terms</a></li>
                  <li><a href="#" className="text-xs hover:text-white">Cookies</a></li>
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase text-white/40 mb-3">Support</p>
                <ul className="space-y-2">
                  <li><a href="#" className="text-xs hover:text-white">Help Center</a></li>
                  <li><a href="#" className="text-xs hover:text-white">Status</a></li>
                  <li><a href="#" className="text-xs hover:text-white">FAQ</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 Ọwọ́. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Powered by Sparynx Technologies</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;