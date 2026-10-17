import React, { useState } from 'react';
import { Camera, Sparkles, HelpCircle, ShieldCheck, ArrowRight, X, Heart, Printer, Star } from 'lucide-react';
import { KioskConfig } from '../types';

interface WelcomeStepProps {
  config: KioskConfig;
  onStart: () => void;
  onOpenPrivacy: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  config,
  onStart,
  onOpenPrivacy,
}) => {
  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      {/* Top Banner Badge */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs sm:text-sm shadow-xs mb-4">
        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
        <span>Karnival MADANI · Zon Inovasi Digital Murid</span>
        <span className="text-blue-300">|</span>
        <span className="text-red-600 font-extrabold">{config.districtName}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
        {/* Left column: Visual 3D Hero */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-red-500 to-amber-400 rounded-3xl blur-xl opacity-35 group-hover:opacity-50 transition duration-500" />

            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white max-w-sm sm:max-w-md">
              <img
                src="/src/assets/images/hero_welcome_avatar_1792217745374.jpg"
                alt="Avatar 3D Murid Karnival MADANI"
                className="w-full h-auto aspect-square object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Floating tag on image */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md text-white p-3 rounded-2xl flex items-center justify-between border border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm">
                    3D
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">Gaya Animasi 3D Disney/Pixar</p>
                    <p className="text-[10px] text-amber-300">Wajah Asli Dikekalkan Cantik!</p>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Typography & Actions */}
        <div className="lg:col-span-7 flex flex-col text-center lg:text-left">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
            Selamat Datang ke <br />
            <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-red-600 bg-clip-text text-transparent">
              MADANI AI Avatar Studio!
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-6 max-w-xl">
            Abadikan kenangan terindah sempena <strong className="text-slate-800">{config.programName}</strong> dengan avatar 3D unik anda. Ambil gambar melalui webcam, pilih gaya kegemaran dan saksikan keajaiban AI menghasilkan potret kartun 3D sedia dicetak!
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-900">Webcam Pantas</h4>
                <p className="text-[11px] text-slate-500">Ambil foto dalam 3 saat</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-900">7 Gaya Avatar 3D</h4>
                <p className="text-[11px] text-slate-500">Chibi, Hero, MADANI & Budaya</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Printer className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-900">Kad Kenangan</h4>
                <p className="text-[11px] text-slate-500">Cetak & Muat Turun Segera</p>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <button
              onClick={onStart}
              className="kiosk-btn w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-extrabold text-lg sm:text-xl rounded-2xl shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>MULA CIPTA AVATAR</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setShowHowTo(true)}
              className="kiosk-btn w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-base rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <span>CARA MENGGUNAKAN</span>
            </button>
          </div>

          {/* Privacy & Safety Note */}
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-emerald-50/80 border border-emerald-200/60 px-3.5 py-2 rounded-xl max-w-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Perlindungan Privasi Murid:</strong> Foto anda diproses secara sementara dalam memori sesi kiosk dan tidak disimpan secara kekal.
            </span>
            <button
              onClick={onOpenPrivacy}
              className="text-emerald-700 font-bold underline ml-auto shrink-0 hover:text-emerald-900"
            >
              Info Lanjut
            </button>
          </div>
        </div>
      </div>

      {/* "Cara Menggunakan" Modal */}
      {showHowTo && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowHowTo(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Cara Menggunakan Kiosk</h3>
                <p className="text-xs text-slate-500">4 langkah mudah untuk menghasilkan avatar anda</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Ambil Gambar Wajah</h4>
                  <p className="text-xs text-slate-600">Berdiri di hadapan webcam, senyum manis dan pastikan wajah berada di dalam bingkai panduan.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Pilih Gaya Avatar 3D</h4>
                  <p className="text-xs text-slate-600">Pilih antara 7 gaya menarik: Animation Hero, Mini Chibi, Little MADANI Hero, Budaya, dan banyak lagi.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">AI Menukarkan Wajah Anda</h4>
                  <p className="text-xs text-slate-600">Sistem AI generatif akan memproses foto anda secara automatik kepada watak kartun 3D berkualiti tinggi.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Reka Kad & Cetak Cenderamata</h4>
                  <p className="text-xs text-slate-600">Masukkan nama murid, pilih templat kad kenangan rasmi PPD Kulim Bandar Baharu dan cetak atau muat turun.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowHowTo(false);
                onStart();
              }}
              className="kiosk-btn w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Faham, Jom Mula Sekarang!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
