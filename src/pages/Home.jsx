import React from 'react';
import { ShieldCheck, Smartphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import cx from 'clsx';
import classes from './Demo.module.css'; // Ensure you have this CSS module or remove the classNames.


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
      className="absolute top-4 right-4"
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
    <div className="fixed inset-0 bg-gradient-to-b from-purple-600 to-blue-700 text-white overflow-y-auto">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Main Container */}
      <div className="flex flex-col items-center px-4">
        <h1 className="text-4xl font-bold mt-8 mb-4">Sparynx Bank</h1>
        <p className="text-lg opacity-90 mb-8 text-center">
          Your modern financial companion for a secure banking experience
        </p>

        {/* Mock Phone Display */}
        <div className="relative mb-12 w-full max-w-sm">
          <div className="bg-gray-900 rounded-3xl p-4 shadow-2xl">
            <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div className="h-3 w-24 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-2 w-16 bg-gray-700 rounded mt-2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 w-5/6 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -right-4 top-1/4 bg-white text-purple-600 p-3 rounded-2xl shadow-lg">
            <Smartphone size={24} />
          </div>
          <div className="absolute -left-4 bottom-1/4 bg-white text-purple-600 p-3 rounded-2xl shadow-lg">
            <ShieldCheck size={24} />
          </div>
        </div>

        {/* Features */}
        <div className="space-y-6 mb-12 w-full max-w-sm">
          <div className="bg-white/10 rounded-xl p-4">
            <h3 className="font-semibold mb-2">Secure Banking</h3>
            <p className="text-sm opacity-80">
              Bank with confidence using our state-of-the-art security features
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <h3 className="font-semibold mb-2">Smart Payments</h3>
            <p className="text-sm opacity-80">
              Send and receive money instantly with zero fees
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4 w-full max-w-sm mb-8">
          <Link to="/register"className="w-full bg-white text-purple-600 font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors">
            <span>Create Account</span>
            <ArrowRight size={20} />
          </Link>
          <button className="w-full bg-white/10 text-white font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors">
            <Link to="/login">Sign In</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
