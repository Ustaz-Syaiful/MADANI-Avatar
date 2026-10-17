import React, { useState, useEffect } from 'react';
import { X, Settings, ShieldCheck, Check, Save, RotateCcw, Activity, Key, Upload } from 'lucide-react';
import { KioskConfig } from '../types';
import { DEFAULT_KIOSK_CONFIG } from '../constants';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: KioskConfig;
  onSaveConfig: (newConfig: KioskConfig) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<KioskConfig>(config);
  const [apiHealth, setApiHealth] = useState<{ status: string; hasKey: boolean; timestamp?: string } | null>(null);
  const [isCheckingApi, setIsCheckingApi] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(config);
      checkHealth();
    }
  }, [isOpen, config]);

  const checkHealth = async () => {
    setIsCheckingApi(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setApiHealth(data);
    } catch (err) {
      setApiHealth({ status: 'error', hasKey: false });
    } finally {
      setIsCheckingApi(false);
    }
  };

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Tetapkan semula semua tetapan kepada tetapan asal?')) {
      setFormData(DEFAULT_KIOSK_CONFIG);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Panel Pentadbir Kiosk</h3>
            <p className="text-xs text-slate-500">
              Konfigurasi maklumat acara Karnival MADANI & tetapan operasi kiosk
            </p>
          </div>
        </div>

        {/* API Status Card */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              apiHealth?.hasKey ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              <Key className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Status Gemini AI:</span>
                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                  apiHealth?.hasKey ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {apiHealth?.hasKey ? 'Kunci API Bersedia' : 'Kunci API Belum Ditetapkan'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {apiHealth?.hasKey
                  ? 'Pelayan beroperasi sepenuhnya untuk menjana avatar AI sebenar.'
                  : 'Sila konfigurasikan GEMINI_API_KEY dalam panel Secrets pelayan.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={checkHealth}
            disabled={isCheckingApi}
            className="text-xs font-bold text-blue-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            {isCheckingApi ? 'Memeriksa...' : 'Periksa Semula'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nama Program:
              </label>
              <input
                type="text"
                value={formData.programName}
                onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Daerah / PPD:
              </label>
              <input
                type="text"
                value={formData.districtName}
                onChange={(e) => setFormData({ ...formData, districtName: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nama Penganjur Lengkap:
              </label>
              <input
                type="text"
                value={formData.organizerName}
                onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tarikh Program:
              </label>
              <input
                type="text"
                value={formData.programDate}
                onChange={(e) => setFormData({ ...formData, programDate: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Slogan Program:
            </label>
            <input
              type="text"
              value={formData.programSlogan}
              onChange={(e) => setFormData({ ...formData, programSlogan: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-semibold"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Logo Penganjur Tersuai (URL atau Data URL):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.customLogoUrl || ''}
                onChange={(e) => setFormData({ ...formData, customLogoUrl: e.target.value || null })}
                placeholder="https://... atau biarkan kosong untuk guna lambang lalai"
                className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              {formData.customLogoUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, customLogoUrl: null })}
                  className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-200"
                >
                  Padam Logo
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Masa Tamat Sesi Kiosk (Saat):
              </label>
              <input
                type="number"
                min="30"
                max="600"
                value={formData.sessionTimeoutSeconds}
                onChange={(e) => setFormData({ ...formData, sessionTimeoutSeconds: parseInt(e.target.value, 10) || 120 })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-semibold"
              />
              <span className="text-[10px] text-slate-400">Nilai cadangan: 120 saat (2 minit)</span>
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formData.inkSaverDefault}
                  onChange={(e) => setFormData({ ...formData, inkSaverDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
                <span className="text-xs font-bold text-slate-700">Lalai Mod Jimat Dakwat (Latar Putih Polos)</span>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="kiosk-btn flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Pulihkan Lalai</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="kiosk-btn px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
              >
                Batal
              </button>

              <button
                type="submit"
                className="kiosk-btn flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Disimpan!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
