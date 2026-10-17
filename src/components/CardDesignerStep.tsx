import React, { useState, useRef, useEffect } from 'react';
import { Printer, Download, RefreshCw, Sparkles, Check, Heart, User, Calendar, FileText, Droplets, Palette, Layers, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CARD_TEMPLATES } from '../constants';
import { AvatarStyle, CardTemplate, CardTemplateId, KioskConfig, PrintFormat } from '../types';

interface CardDesignerStepProps {
  avatarUrl: string;
  userPhoto: string;
  style: AvatarStyle;
  config: KioskConfig;
  onResetAndStartNew: () => void;
  onBackToEdit: () => void;
}

export const CardDesignerStep: React.FC<CardDesignerStepProps> = ({
  avatarUrl,
  style,
  config,
  onResetAndStartNew,
  onBackToEdit,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<CardTemplateId>('madani_celebration');
  const [studentName, setStudentName] = useState<string>('MURID KEBANGGAAN');
  const [schoolName, setSchoolName] = useState<string>('PPD KULIM BANDAR BAHARU');
  const [format, setFormat] = useState<PrintFormat>('a4');
  const [isInkSaver, setIsInkSaver] = useState<boolean>(config.inkSaverDefault);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#dc2626', '#eab308', '#10b981'],
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const currentTemplate = CARD_TEMPLATES.find((t) => t.id === selectedTemplateId) || CARD_TEMPLATES[0];

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // High-res PNG Export (crisp 300 DPI equivalent)
  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setExportMessage('Menyediakan fail PNG resolusi tinggi...');

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High DPI render
        useCORS: true,
        allowTaint: true,
        backgroundColor: isInkSaver ? '#ffffff' : null,
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const safeName = studentName.trim().replace(/\s+/g, '_') || 'Murid';
      link.download = `Avatar_MADANI_${safeName}_${format.toUpperCase()}.png`;
      link.href = image;
      link.click();
      setExportMessage('Muat turun PNG berjaya!');
      setTimeout(() => setExportMessage(null), 3000);
    } catch (error) {
      console.error('Gagal muat turun PNG:', error);
      setExportMessage('Ralat semasa menjana PNG.');
    } finally {
      setIsExporting(false);
    }
  };

  // High-res PDF Export
  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setExportMessage('Menjana dokumen PDF sedia cetak...');

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: isInkSaver ? '#ffffff' : null,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      let pdfFormat: [number, number] | string = 'a4';
      let orientation: 'p' | 'portrait' = 'p';

      if (format === 'a4') {
        pdfFormat = 'a4';
      } else if (format === 'a5') {
        pdfFormat = 'a5';
      } else if (format === '4r') {
        // 4x6 inches in mm (102 x 152 mm)
        pdfFormat = [102, 152];
      } else {
        // Square 150x150 mm
        pdfFormat = [150, 150];
      }

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: pdfFormat,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Fit with small margin
      const margin = 5;
      const targetWidth = pageWidth - margin * 2;
      const targetHeight = (canvas.height * targetWidth) / canvas.width;

      let renderHeight = targetHeight;
      let renderWidth = targetWidth;

      if (targetHeight > pageHeight - margin * 2) {
        renderHeight = pageHeight - margin * 2;
        renderWidth = (canvas.width * renderHeight) / canvas.height;
      }

      const x = (pageWidth - renderWidth) / 2;
      const y = (pageHeight - renderHeight) / 2;

      pdf.addImage(imgData, 'JPEG', x, y, renderWidth, renderHeight);
      const safeName = studentName.trim().replace(/\s+/g, '_') || 'Murid';
      pdf.save(`Kad_Kenangan_MADANI_${safeName}_${format.toUpperCase()}.pdf`);

      setExportMessage('Muat turun PDF selesai!');
      setTimeout(() => setExportMessage(null), 3000);
    } catch (error) {
      console.error('Gagal menjana PDF:', error);
      setExportMessage('Ralat semasa mengeksport PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  // Dimensions helper for screen preview based on format
  const getFormatClass = () => {
    switch (format) {
      case 'a4':
        return 'w-full max-w-[440px] aspect-[1/1.414]';
      case 'a5':
        return 'w-full max-w-[380px] aspect-[1/1.414]';
      case '4r':
        return 'w-full max-w-[360px] aspect-[4/6]';
      case 'square':
        return 'w-full max-w-[390px] aspect-square';
      default:
        return 'w-full max-w-[420px] aspect-[1/1.414]';
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 flex flex-col justify-between">
      {/* Top Header */}
      <div className="no-print flex items-center justify-between mb-4">
        <button
          onClick={onBackToEdit}
          className="kiosk-btn flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Avatar</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Langkah 5: Reka Kad Kenangan & Cetak Cenderamata
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Pilih templat kegemaran anda, masukkan nama murid dan cetak sebagai kenangan karnival!
          </p>
        </div>

        <button
          onClick={onResetAndStartNew}
          className="kiosk-btn flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sesi Baharu</span>
        </button>
      </div>

      {/* Main Grid: Controls Left, Live Card Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customizer Controls (No-print) */}
        <div className="no-print lg:col-span-6 space-y-4">
          {/* Card Template Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
              <Palette className="w-4 h-4 text-blue-600" />
              <span>Pilih Reka Bentuk Templat Kad</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CARD_TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === selectedTemplateId;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`kiosk-btn p-3 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900">{tmpl.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                      {tmpl.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Student Info Inputs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Maklumat Murid pada Kad</span>
            </label>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Nama Murid:</label>
              <input
                type="text"
                value={studentName}
                maxLength={32}
                onChange={(e) => setStudentName(e.target.value.toUpperCase())}
                placeholder="NAMA MURID"
                className="w-full text-sm font-extrabold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Nama Sekolah / Unit:</label>
              <input
                type="text"
                value={schoolName}
                maxLength={40}
                onChange={(e) => setSchoolName(e.target.value.toUpperCase())}
                placeholder="SEKOLAH / PPD KULIM BANDAR BAHARU"
                className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Sizing & Ink Saver Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Format Tabs */}
            <div>
              <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1.5 block">
                Format Saiz Cetakan:
              </label>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['a4', 'a5', '4r', 'square'] as PrintFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`kiosk-btn px-2.5 py-1 text-xs font-bold rounded-lg uppercase transition-colors ${
                      format === fmt
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Ink Saver Toggle */}
            <div className="flex items-center gap-2 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={() => setIsInkSaver(!isInkSaver)}
                className={`kiosk-btn flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  isInkSaver
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Droplets className="w-4 h-4 text-amber-600" />
                <span>{isInkSaver ? 'Jimat Dakwat: ON' : 'Latar Ceria (Biasa)'}</span>
              </button>
            </div>
          </div>

          {/* Export & Print Action Buttons */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Tindakan Cetakan & Simpanan
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={handlePrint}
                className="kiosk-btn py-3.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>CETAK SEGERA</span>
              </button>

              <button
                onClick={handleDownloadPNG}
                disabled={isExporting}
                className="kiosk-btn py-3.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>MUAT TURUN PNG</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isExporting}
                className="kiosk-btn py-3.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <FileText className="w-4 h-4 text-red-400" />
                <span>MUAT TURUN PDF</span>
              </button>
            </div>

            {exportMessage && (
              <p className="text-xs text-center font-bold text-emerald-300 animate-pulse pt-1">
                {exportMessage}
              </p>
            )}

            <button
              onClick={onResetAndStartNew}
              className="kiosk-btn w-full py-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Selesai & Kosongkan Sesi untuk Murid Seterusnya</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Printable Card Area */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="no-print text-center mb-2">
            <span className="text-xs font-bold text-slate-500">
              Pratonton Sebenar Cetakan ({format.toUpperCase()})
            </span>
          </div>

          {/* Printable Card Wrapper */}
          <div className="print-area-container flex items-center justify-center w-full">
            <div
              ref={cardRef}
              className={`print-card ${getFormatClass()} ${
                isInkSaver ? 'bg-white border-2 border-slate-300' : currentTemplate.cardBg
              } rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between border-4 ${
                isInkSaver ? 'border-slate-300' : currentTemplate.borderStyle
              } transition-all relative p-5`}
            >
              {/* Card Header */}
              <div
                className={`rounded-2xl p-3.5 ${
                  isInkSaver ? 'bg-slate-100 text-slate-900 border border-slate-200' : currentTemplate.headerStyle
                } text-center shadow-xs relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    {config.programName}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-90">
                    {config.districtName}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black tracking-tight drop-shadow-xs">
                  MADANI AI AVATAR STUDIO
                </h3>

                <p className="text-[10px] sm:text-xs font-semibold opacity-90 italic">
                  “{config.programSlogan}”
                </p>
              </div>

              {/* Central 3D Avatar Image */}
              <div className="my-3 flex-1 flex flex-col items-center justify-center">
                <div className="w-[84%] aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-900 relative">
                  <img
                    src={avatarUrl}
                    alt={`Avatar 3D ${studentName}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {/* Corner Style Tag */}
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center justify-between border border-white/20">
                    <span>{style.name}</span>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Card Footer: Student Info & Official Seal */}
              <div
                className={`rounded-2xl p-3 ${
                  isInkSaver ? 'bg-slate-50 border border-slate-200' : 'bg-white/95 border border-slate-200/80'
                } shadow-xs text-center`}
              >
                <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">
                  CENDERAMATA KENANGAN KHAS
                </p>

                <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-wide leading-tight truncate">
                  {studentName || 'MURID KEBANGGAAN'}
                </h4>

                <p className="text-[11px] font-bold text-blue-700 truncate mb-1">
                  {schoolName || config.organizerName}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/70 text-[9px] font-semibold text-slate-500">
                  <span>Tarikh: {config.programDate}</span>
                  <span className="font-bold text-red-600">MALAYSIA MADANI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
