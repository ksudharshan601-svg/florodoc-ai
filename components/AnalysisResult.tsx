import React from 'react';
import { DiseaseAnalysisResult } from '../types';
import { Activity, AlertCircle, CheckCircle, Droplets, FlaskConical, ShieldAlert, ShieldCheck, ThermometerSun } from 'lucide-react';

interface AnalysisResultProps {
  data: DiseaseAnalysisResult;
  imageSrc: string;
  onReset: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, imageSrc, onReset }) => {
  if (!data.isPlant) {
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-16 w-16 text-red-500 dark:text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">Not a Plant</h2>
        <p className="text-red-600 dark:text-red-300/80 mb-6">
          Our AI couldn't detect a plant in this image. Please upload a clear photo of a leaf or plant.
        </p>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  const isHealthy = data.condition.toLowerCase().includes('healthy');
  // Dynamic colors based on health status + dark mode adjustments
  const healthColor = isHealthy ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400';
  const healthBg = isHealthy ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30';
  const healthBorder = isHealthy ? 'border-green-200 dark:border-green-800' : 'border-amber-200 dark:border-amber-800';
  const progressBarColor = isHealthy ? 'bg-green-500' : 'bg-amber-500';

  return (
    <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
      {/* Left Column: Image & Quick Stats */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800">
          <img
            src={imageSrc}
            alt="Analyzed Plant"
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 space-y-4 transition-colors">
          <div>
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Identified Plant</span>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{data.plantName}</h3>
          </div>
          
          <div>
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Condition</span>
            <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${healthBg} ${healthColor} ${healthBorder}`}>
              {isHealthy ? <CheckCircle size={16} className="mr-2" /> : <AlertCircle size={16} className="mr-2" />}
              {data.condition}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Confidence</span>
            <div className="flex items-center mt-1">
              <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-700 rounded-full mr-3">
                <div 
                  className={`h-2 rounded-full ${progressBarColor}`} 
                  style={{ width: `${data.confidence}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{data.confidence}%</span>
            </div>
          </div>

          <button
            onClick={onReset}
            className="w-full py-2.5 mt-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
          >
            Analyze Another
          </button>
        </div>
      </div>

      {/* Right Column: Detailed Info */}
      <div className="md:col-span-2 space-y-6">
        {/* Diagnosis */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 transition-colors">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <ShieldAlert className="mr-2 text-emerald-600 dark:text-emerald-400" /> Diagnosis Report
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            {data.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                <ThermometerSun size={16} className="mr-2 text-orange-500" /> Symptoms
              </h4>
              <ul className="space-y-1">
                {data.symptoms.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="mr-2 text-emerald-500">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            {data.causes && data.causes.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                   <Activity size={16} className="mr-2 text-purple-500" /> Potential Causes
                </h4>
                <ul className="space-y-1">
                  {data.causes.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                       <span className="mr-2 text-emerald-500">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Treatment Plan - Only show if not healthy */}
        {!isHealthy && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 transition-colors">
             <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
              <ShieldCheck className="mr-2 text-emerald-600 dark:text-emerald-400" /> Treatment Plan
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Organic */}
              <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-5 border border-green-100 dark:border-green-800/30">
                <h3 className="font-bold text-green-800 dark:text-green-300 mb-3 flex items-center">
                  <Droplets className="mr-2" size={18} /> Organic Solutions
                </h3>
                <ul className="space-y-2">
                  {data.treatments.organic.map((item, idx) => (
                    <li key={idx} className="text-sm text-green-800 dark:text-green-200/80 flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chemical */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                  <FlaskConical className="mr-2" size={18} /> Chemical Treatments
                </h3>
                <ul className="space-y-2">
                  {data.treatments.chemical.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full mt-1.5 mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Prevention */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 transition-colors">
           <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">Prevention Tips</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             {data.prevention.map((item, idx) => (
               <div key={idx} className="flex items-start bg-emerald-50/50 dark:bg-emerald-900/20 p-3 rounded-lg">
                 <span className="font-bold text-emerald-200 dark:text-emerald-800 text-2xl leading-none mr-3">{idx + 1}</span>
                 <span className="text-sm text-gray-700 dark:text-gray-300 pt-1">{item}</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};