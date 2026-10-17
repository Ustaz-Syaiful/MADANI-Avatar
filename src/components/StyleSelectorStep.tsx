import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Check, Sparkle, HeartHandshake, Zap, Award, Palette, Crown, Smile, MessageSquare } from 'lucide-react';
import { AVATAR_STYLES } from '../constants';
import { AvatarStyle } from '../types';

interface StyleSelectorStepProps {
  userPhoto: string;
  selectedStyleId: string;
  onSelectStyle: (styleId: string, customNotes?: string) => void;
  onBack: () => void;
  onProceedToGenerate: (styleId: string, customNotes?: string) => void;
}

export const StyleSelectorStep: React.FC<StyleSelectorStepProps> = ({
  userPhoto,
  selectedStyleId,
  onSelectStyle,
  onBack,
  onProceedToGenerate,
}) => {
  const [activeId, setActiveId] = useState<string>(selectedStyleId || 'hero');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [showAdvancedNotes, setShowAdvancedNotes] = useState<boolean>(false);

  const getStyleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return Sparkles;
      case 'Smile': return Smile;
      case 'HeartHandshake': return HeartHandshake;
      case 'Zap': return Zap;
      case 'Award': return Award;
      case 'Palette': return Palette;
      case 'Crown': return Crown;
      default: return Sparkles;
    }
  };

  const handleSelect = (id: string) => {
    setActiveId(id);
    onSelectStyle(id, customNotes);
  };

  const handleGenerate = () => {
    onProceedToGenerate(activeId, customNotes);
  };

  const selectedStyle = AVATAR_STYLES.find((s) => s.id === activeId) || AVATAR_STYLES[0];

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="kiosk-btn flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tukar Gambar</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Langkah 3: Pilih Gaya Avatar 3D Kegemaran Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Setiap gaya mengekalkan wajah asli anda dalam visual animasi 3D yang unik!
          </p>
        </div>

        {/* User Mini Photo Avatar Preview */}
        <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-2xl border border-slate-200 shadow-xs">
          <img
            src={userPhoto}
            alt="Foto Rujukan Anda"
            className="w-8 h-8 rounded-full object-cover border border-blue-500"
            referrerPolicy="no-referrer"
          />
          <span className="text-[11px] font-bold text-slate-700 hidden sm:inline">Foto Anda</span>
        </div>
      </div>

      {/* 7 Styles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6 overflow-y-auto max-h-[58vh] p-1">
        {AVATAR_STYLES.map((style) => {
          const isSelected = style.id === activeId;
          const IconComponent = getStyleIcon(style.iconName);

          return (
            <div
              key={style.id}
              onClick={() => handleSelect(style.id)}
              className={`kiosk-btn relative rounded-2xl cursor-pointer p-4 transition-all duration-200 text-left flex flex-col justify-between border-2 ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-600 shadow-lg ring-4 ring-blue-100 scale-[1.02]'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {style.badge}
                </span>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Visual Card Banner */}
              <div
                className={`w-full h-24 rounded-xl ${style.previewGradient} p-3 mb-3 text-white flex flex-col justify-between shadow-inner relative overflow-hidden`}
              >
                <div className="absolute right-2 -bottom-2 opacity-15">
                  <IconComponent className="w-24 h-24" />
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-white/90 drop-shadow-xs">
                    {style.tagline}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-white/80 z-10">
                  Animasi 3D Studio
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-1">
                  <span>{style.name}</span>
                </h3>
                <p className="text-xs text-slate-600 leading-snug mb-3">
                  {style.description}
                </p>

                {/* Micro Features */}
                <div className="flex flex-wrap gap-1">
                  {style.features.map((f, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium"
                    >
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Selected style reminder & optional notes */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Gaya Dipilih:</p>
            <p className="text-sm sm:text-base font-black text-slate-900">{selectedStyle.name}</p>
          </div>

          <button
            onClick={() => setShowAdvancedNotes(!showAdvancedNotes)}
            className="ml-auto sm:ml-4 text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 underline cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{showAdvancedNotes ? 'Tutup Nota' : '+ Tambah Nota Wajah'}</span>
          </button>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="kiosk-btn w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-black text-base sm:text-lg rounded-xl shadow-xl hover:shadow-2xl flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Sparkle className="w-5 h-5 text-yellow-300 animate-spin" />
          <span>JANA AVATAR SAYA</span>
        </button>
      </div>

      {/* Optional Custom Notes Input */}
      {showAdvancedNotes && (
        <div className="mt-3 p-3 bg-blue-50/80 rounded-xl border border-blue-200">
          <label className="text-xs font-bold text-blue-900 mb-1 block">
            Nota Tambahan Ciri Khas (Pilihan):
          </label>
          <input
            type="text"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Cth: Cermin mata bulat bingkai hitam, senyuman ceria, baju sekolah pengawas..."
            className="w-full text-xs p-2.5 bg-white rounded-lg border border-blue-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};
