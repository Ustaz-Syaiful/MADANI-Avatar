import React from 'react';
import { Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

interface TimeoutWarningModalProps {
  isOpen: boolean;
  timeLeft: number;
  onExtendSession: () => void;
  onFinishNow: () => void;
}

export const TimeoutWarningModal: React.FC<TimeoutWarningModalProps> = ({
  isOpen,
  timeLeft,
  onExtendSession,
  onFinishNow,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center border-4 border-amber-400 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Clock className="w-10 h-10" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
          Adakah Anda Masih Di Sini?
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
          Sesi kiosk ini akan dikosongkan secara automatik demi menjaga keselamatan data foto murid dalam masa:
        </p>

        {/* Big countdown number */}
        <div className="text-5xl font-black text-amber-600 mb-6 font-mono">
          {timeLeft}s
        </div>

        <div className="space-y-3">
          <button
            onClick={onExtendSession}
            className="kiosk-btn w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>SAYA MASIH DI SINI! (LANJUTKAN)</span>
          </button>

          <button
            onClick={onFinishNow}
            className="kiosk-btn w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Selesai & Kosongkan Sesi Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
