import React from 'react';
import { Camera, Palette, Sparkles, Printer, Home, Check } from 'lucide-react';
import { AppStep } from '../types';

interface StepProgressBarProps {
  currentStep: AppStep;
  onNavigateToStep?: (step: AppStep) => void;
  canNavigateBack: boolean;
}

const STEPS = [
  { id: 'welcome', label: '1. Mula', icon: Home },
  { id: 'camera', label: '2. Ambil Gambar', icon: Camera },
  { id: 'style', label: '3. Pilih Gaya', icon: Palette },
  { id: 'generating', label: '4. Jana Avatar AI', icon: Sparkles },
  { id: 'design', label: '5. Reka & Cetak Kad', icon: Printer },
];

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
}) => {
  const getStepIndex = (step: AppStep) => {
    switch (step) {
      case 'welcome': return 0;
      case 'camera': return 1;
      case 'style': return 2;
      case 'generating': return 3;
      case 'design':
      case 'print': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="no-print w-full bg-slate-50 border-b border-slate-200/80 py-2.5 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between relative">
        {/* Horizontal connector line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-red-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {STEPS.map((s, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const IconComponent = s.icon;

          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm ${
                  isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110 shadow-md'
                    : isDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <IconComponent className="w-4 h-4" />}
              </div>

              <span
                className={`text-[10px] sm:text-xs font-bold mt-1 tracking-tight transition-colors ${
                  isCurrent
                    ? 'text-blue-700 font-extrabold'
                    : isDone
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
