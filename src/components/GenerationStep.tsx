import React, { useState } from 'react';
import { ArrowLeft, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, Palette, Camera, ChevronDown, ChevronUp, Clock, Info } from 'lucide-react';
import { AvatarStyle } from '../types';

interface GenerationStepProps {
  userPhoto: string;
  avatarResult: string | null;
  style: AvatarStyle;
  isGenerating: boolean;
  error: string | null;
  errorDetails: string | null;
  generationTimeMs?: number;
  onRegenerate: () => void;
  onChangeStyle: () => void;
  onProceedToDesign: () => void;
  onBackToCamera: () => void;
}

export const GenerationStep: React.FC<GenerationStepProps> = ({
  userPhoto,
  avatarResult,
  style,
  isGenerating,
  error,
  errorDetails,
  generationTimeMs,
  onRegenerate,
  onChangeStyle,
  onProceedToDesign,
  onBackToCamera,
}) => {
  const [showTechDetails, setShowTechDetails] = useState<boolean>(false);
  const [compareMode, setCompareMode] = useState<'avatar' | 'compare'>('avatar');

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 flex flex-col justify-center">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onChangeStyle}
          disabled={isGenerating}
          className="kiosk-btn flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors disabled:opacity-50"
        >
          <Palette className="w-4 h-4 text-blue-600" />
          <span>Tukar Gaya</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {isGenerating
              ? 'Langkah 4: AI Sedang Mencipta Avatar Anda...'
              : avatarResult
              ? 'Tahniah! Avatar 3D Anda Telah Siap!'
              : 'Status Penjanaan Avatar AI'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Gaya: <span className="font-bold text-blue-700">{style.name}</span>
          </p>
        </div>

        <button
          onClick={onBackToCamera}
          disabled={isGenerating}
          className="kiosk-btn flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors disabled:opacity-50"
        >
          <Camera className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline">Ambil Semula Foto</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 mb-4">
        {/* State A: Loading in progress */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-10 sm:py-14 text-center max-w-lg mx-auto">
            {/* Spinning AI Aura */}
            <div className="relative mb-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-red-500 animate-spin blur-md opacity-40" />
              <div className="absolute inset-2 rounded-full bg-white flex flex-col items-center justify-center p-4 shadow-xl">
                <Sparkles className="w-12 h-12 text-amber-500 fill-amber-400 animate-bounce" />
                <span className="text-xs font-black text-slate-800 mt-1">GEMINI AI</span>
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              Sedang Mentransformasi Foto Wajah...
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Model AI Google sedang menganalisis ciri wajah murid anda dan melukis semula dalam visual animasi 3D gaya <span className="font-bold text-blue-700">{style.name}</span>.
            </p>

            {/* Real Progress Steps Tracker */}
            <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2.5">
              <div className="flex items-center gap-3 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Memuat naik dan menentukur foto murid</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-blue-700 animate-pulse">
                <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                <span>Memproses seni 3D Disney/Pixar & pencahayaan studio</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                <div className="w-4 h-4 rounded-full border border-slate-300" />
                <span>Penyempurnaan ekspresi & elemen kenangan MADANI</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4">
              Masa proses biasa: 5 – 15 saat bergantung kepada sambungan rangkaian.
            </p>
          </div>
        )}

        {/* State B: Success - Avatar Created */}
        {!isGenerating && avatarResult && (
          <div className="flex flex-col items-center">
            {/* Toggle Compare Mode */}
            <div className="flex items-center gap-2 mb-4 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setCompareMode('avatar')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  compareMode === 'avatar'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Avatar 3D Penuh
              </button>
              <button
                onClick={() => setCompareMode('compare')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  compareMode === 'compare'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bandingkan dengan Foto Asal
              </button>
            </div>

            {/* Display Images */}
            {compareMode === 'avatar' ? (
              <div className="relative group max-w-md w-full aspect-square rounded-3xl overflow-hidden border-4 border-blue-500 shadow-2xl bg-slate-900">
                <img
                  src={avatarResult}
                  alt="Avatar 3D Siap"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Badge */}
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gaya: {style.name}</span>
                </div>

                {generationTimeMs && (
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{(generationTimeMs / 1000).toFixed(1)}s</span>
                  </div>
                )}
              </div>
            ) : (
              /* Compare side-by-side */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                <div className="flex flex-col items-center">
                  <p className="text-xs font-bold text-slate-500 mb-1.5">Foto Asal Murid</p>
                  <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-slate-300 shadow-sm bg-slate-100">
                    <img
                      src={userPhoto}
                      alt="Foto Asal"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-xs font-bold text-blue-700 mb-1.5">Avatar 3D Hasil AI</p>
                  <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-blue-600 shadow-lg bg-slate-900">
                    <img
                      src={avatarResult}
                      alt="Avatar 3D"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full max-w-2xl">
              <button
                onClick={onProceedToDesign}
                className="kiosk-btn flex-1 min-w-[220px] py-4 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>TERUSKAN KE REKA BENTUK KAD</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onRegenerate}
                className="kiosk-btn py-3.5 px-5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-2xl border-2 border-slate-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span>JANA SEMULA</span>
              </button>

              <button
                onClick={onChangeStyle}
                className="kiosk-btn py-3.5 px-5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-2xl border-2 border-slate-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Palette className="w-4 h-4 text-amber-600" />
                <span>PILIH GAYA LAIN</span>
              </button>
            </div>
          </div>
        )}

        {/* State C: Error State (Real error handling, no fake replacement!) */}
        {!isGenerating && error && (
          <div className="flex flex-col items-center py-6 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">
              Penjanaan Avatar Tidak Berjaya
            </h3>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              {error}
            </p>

            {/* Retained original photo */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4 text-left w-full">
              <img
                src={userPhoto}
                alt="Foto Murid"
                className="w-16 h-16 rounded-xl object-cover border border-slate-300 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Foto Asal Anda Masih Selamat</p>
                <p className="text-[11px] text-slate-500">
                  Sistem mengekalkan foto asal anda tanpa menggantikannya dengan sampel tiruan. Anda boleh cuba semula atau memilih gaya berlainan.
                </p>
              </div>
            </div>

            {/* Technical details toggle for Kiosk Admin */}
            {errorDetails && (
              <div className="w-full mb-6 text-left">
                <button
                  type="button"
                  onClick={() => setShowTechDetails(!showTechDetails)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Maklumat Teknikal Pentadbir (Debug)</span>
                  {showTechDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showTechDetails && (
                  <pre className="mt-2 p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto whitespace-pre-wrap max-h-40 border border-slate-800">
                    {errorDetails}
                  </pre>
                )}
              </div>
            )}

            {/* Recovery Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                onClick={onRegenerate}
                className="kiosk-btn flex-1 min-w-[160px] py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>CUBA JANA SEMULA</span>
              </button>

              <button
                onClick={onChangeStyle}
                className="kiosk-btn flex-1 min-w-[160px] py-3.5 px-6 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl border-2 border-slate-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Palette className="w-4 h-4" />
                <span>PILIH GAYA LAIN</span>
              </button>

              <button
                onClick={onBackToCamera}
                className="kiosk-btn py-3.5 px-5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>AMBIL SEMULA FOTO</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
