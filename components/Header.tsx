import React from 'react';
import { Leaf, Activity, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <header className="bg-emerald-900 dark:bg-emerald-950 text-white shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Leaf size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">FloraDoc AI</h1>
            <p className="text-xs text-emerald-300">Plant Pathology Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-sm font-medium text-emerald-100">
          <span className="hidden md:flex items-center space-x-1">
            <Activity size={16} />
            <span>Instant Analysis</span>
          </span>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-emerald-800 dark:hover:bg-emerald-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-300" />
            ) : (
              <Moon size={20} className="text-emerald-100" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};