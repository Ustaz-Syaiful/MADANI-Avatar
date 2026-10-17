import React from 'react';
import { Shield, Sparkles, RefreshCw, Maximize2, Minimize2, Settings, Clock } from 'lucide-react';
import { KioskConfig } from '../types';

interface HeaderProps {
  config: KioskConfig;
  timeLeft: number;
  onResetSession: () => void;
  onOpenAdmin: () => void;
  onOpenPrivacy: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  hasActiveSession: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  timeLeft,
  onResetSession,
  onOpenAdmin,
  onOpenPrivacy,
  isFullscreen,
  onToggleFullscreen,
  hasActiveSession,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <header className="no-print w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Logo container */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-red-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
            {config.customLogoUrl ? (
              <img
                src={config.customLogoUrl}
                alt="Logo Penganjur"
                className="w-full h-full object-contain rounded-[10px] bg-white p-1"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full rounded-[10px] bg-white flex flex-col items-center justify-center p-1 text-center">
                <div className="flex items-center gap-0.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
                <span className="text-[9px] font-black tracking-tighter text-blue-900 leading-tight mt-0.5">
                  PPD KBB
                </span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-red-600">
                {config.programName}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-800">
                {config.districtName}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>MADANI AI AVATAR STUDIO</span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:block">
              “Jom Cipta Avatar 3D Anda!” — <span className="text-blue-600 font-semibold">{config.programSlogan}</span>
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Session Countdown */}
          {hasActiveSession && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              timeLeft < 30 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-50 text-blue-700'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>Sesi Kiosk: {formatTime(timeLeft)}</span>
            </div>
          )}

          {/* Clear Session / Reset */}
          {hasActiveSession && (
            <button
              onClick={onResetSession}
              title="Padam Foto & Mulakan Sesi Baru"
              className="kiosk-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Padam Sesi</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Keluar Skrin Penuh' : 'Mod Skrin Penuh'}
            className="kiosk-btn p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Privacy Notice Button */}
          <button
            onClick={onOpenPrivacy}
            title="Notis Privasi Murid"
            className="kiosk-btn flex items-center gap-1 p-2 sm:px-3 sm:py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors"
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="hidden lg:inline">Privasi Murid</span>
          </button>

          {/* Admin Settings Button */}
          <button
            onClick={onOpenAdmin}
            title="Tetapan Pentadbir Kiosk"
            className="kiosk-btn p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
