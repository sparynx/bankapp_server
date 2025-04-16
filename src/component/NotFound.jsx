import React from 'react';
import { Link } from 'react-router-dom';
import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { Home, ArrowLeft, Search } from 'lucide-react';

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

const NotFound = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900 text-white overflow-y-auto">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="absolute top-1/3 -left-24 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Header/Navigation */}
      <header className="w-full py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link to="/" className="text-2xl font-bold tracking-tight flex items-center">
            <span className="text-blue-400 mr-1">Ọ</span><span>wọ́</span>
          </Link>
        </div>
      </header>

      {/* 404 Content */}
      <div className="flex flex-col items-center justify-center px-6 h-[70vh]">
        <div className="w-full max-w-lg text-center">
          {/* 404 Message */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold text-blue-400/80 mb-4">404</h1>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 inline-block mb-6">
              <p className="text-xl md:text-2xl font-medium">Page Not Found</p>
            </div>
            <p className="text-white/70 max-w-md mx-auto mb-8">
              The page you're looking for doesn't exist or has been moved. Please check the URL or navigate back to our homepage.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link to="/" className="bg-blue-500 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-all">
              <Home size={18} className="mr-2" />
              <span>Back to Home</span>
            </Link>
            <Link to="/search" className="bg-white/10 border border-white/10 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center hover:bg-white/15 transition-all">
              <Search size={18} className="mr-2" />
              <span>Search</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-white/60 text-sm px-6 py-6 absolute bottom-0">
        <div className="max-w-6xl mx-auto border-t border-white/10 pt-6">
          <p>© 2025 Ọwọ́. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;