import React from 'react';
import { X, ShieldCheck, Lock, Trash2, Camera, EyeOff } from 'lucide-react';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyNoticeModal: React.FC<PrivacyNoticeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Notis Privasi & Keselamatan Murid
            </h3>
            <p className="text-xs text-slate-500">
              Polisi Perlindungan Data Karnival MADANI PPD Kulim Bandar Baharu
            </p>
          </div>
        </div>

        {/* Key Policies */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-900 mb-1">
                Tiada Penyimpanan Data Biometrik atau Pangkalan Data Kekal
              </h4>
              <p className="text-emerald-800 text-xs">
                Foto murid hanya disimpan secara sementara di dalam memori kiosk sepanjang sesi aktif pengguna. Foto asal dan avatar yang dijana tidak dimasukkan ke dalam sebarang pangkalan data profil murid atau arkib awam.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
            <Camera className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">
                Pemprosesan Model AI Google
              </h4>
              <p className="text-blue-800 text-xs">
                Foto dihantar kepada API Gemini untuk tujuan transformasi animasi 3D keluarga sahaja. Model diarahkan khusus untuk mengekalkan wajah asli murid secara beradab dan tidak membenarkan pengubahsuaian yang tidak bersesuaian.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
            <Trash2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 mb-1">
                Pembersihan Sesi Kiosk Automatik
              </h4>
              <p className="text-amber-800 text-xs">
                Setiap kali butang “Padam Sesi” atau “Sesi Baharu” ditekan, atau apabila had masa terbiar (timeout) dicapai, semua data foto akan dipadamkan daripada memori aplikasi serta-merta supaya tidak dipaparkan kepada murid seterusnya.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-1">
                Kebenaran Penjaga & Sekolah
              </h4>
              <p className="text-slate-600 text-xs">
                Aktiviti bergambar di kiosk ini adalah sebahagian daripada penglibatan acara Karnival MADANI anjuran PPD Kulim Bandar Baharu bagi memupuk minat murid terhadap teknologi AI dan inovasi digital pendidikan.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="kiosk-btn px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Faham & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
