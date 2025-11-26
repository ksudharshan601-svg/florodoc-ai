import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzePlantImage } from './services/geminiService';
import { AnalysisState } from './types';
import { Loader2, Sprout } from 'lucide-react';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    loading: false,
    error: null,
    data: null,
  });
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check local storage or system preference on initial load
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('floraDocTheme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply theme class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('floraDocTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('floraDocTheme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleImageSelect = async (base64: string) => {
    setSelectedImage(base64);
    setAnalysis({ loading: true, error: null, data: null });

    try {
      const result = await analyzePlantImage(base64);
      setAnalysis({ loading: false, error: null, data: result });
    } catch (err: any) {
      setAnalysis({
        loading: false,
        error: "Failed to analyze image. Please try again.",
        data: null,
      });
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysis({ loading: false, error: null, data: null });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <main className="container mx-auto px-4 py-8">
        {!selectedImage && (
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mb-4">
              Identify <span className="text-emerald-600 dark:text-emerald-400">Plant Diseases</span> Instantly
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload a photo of your sick plant or leaf. Our advanced AI will diagnose the issue and recommend treatment in seconds.
            </p>
          </div>
        )}

        {/* View State: Upload */}
        {!selectedImage && <ImageUpload onImageSelected={handleImageSelect} />}

        {/* View State: Loading */}
        {analysis.loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-200 dark:bg-emerald-800 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-white dark:bg-slate-900 p-6 rounded-full shadow-lg border border-emerald-100 dark:border-emerald-900">
                <Loader2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400 animate-spin" />
              </div>
            </div>
            <h3 className="mt-8 text-xl font-bold text-slate-800 dark:text-slate-100">Analyzing Plant Health...</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md text-center">
              Our AI is examining leaves, stems, and patterns to detect potential diseases.
            </p>
            
            <div className="mt-8 flex items-center space-x-2 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800">
              <Sprout size={16} />
              <span>Did you know? Early detection can save 80% of crops.</span>
            </div>
          </div>
        )}

        {/* View State: Error */}
        {analysis.error && !analysis.loading && (
           <div className="max-w-md mx-auto mt-12 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center shadow-sm">
             <h3 className="text-red-800 dark:text-red-300 font-bold text-lg mb-2">Analysis Error</h3>
             <p className="text-red-600 dark:text-red-400 mb-6">{analysis.error}</p>
             <button 
               onClick={handleReset}
               className="px-6 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 font-medium transition-colors"
             >
               Try Again
             </button>
           </div>
        )}

        {/* View State: Results */}
        {analysis.data && !analysis.loading && selectedImage && (
          <AnalysisResult 
            data={analysis.data} 
            imageSrc={selectedImage} 
            onReset={handleReset} 
          />
        )}
      </main>

      <footer className="mt-20 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Results are for informational purposes only. Consult a professional botanist for critical agricultural decisions.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;