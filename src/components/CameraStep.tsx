import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, Check, Upload, AlertCircle, Sparkles, Sun, Eye, FlipHorizontal, ArrowLeft, Video, VideoOff } from 'lucide-react';

interface CameraStepProps {
  onPhotoCaptured: (imageDataUrl: string) => void;
  onBack: () => void;
  savedPhoto: string | null;
}

export const CameraStep: React.FC<CameraStepProps> = ({
  onPhotoCaptured,
  onBack,
  savedPhoto,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(savedPhoto);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4'>('1:1');
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [videoResolution, setVideoResolution] = useState<{ width: number; height: number } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch available cameras
  const getCameraDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === 'videoinput');
      setAvailableDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.warn('Unable to list media devices', err);
    }
  }, [selectedDeviceId]);

  // Bind stream to video element whenever stream changes or video element is mounted
  const attachStreamToVideo = useCallback((videoElement: HTMLVideoElement | null, mediaStream: MediaStream | null) => {
    if (!videoElement || !mediaStream) return;

    if (videoElement.srcObject !== mediaStream) {
      videoElement.srcObject = mediaStream;
    }

    videoElement.onloadedmetadata = () => {
      setVideoResolution({
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      });
      videoElement.play().catch((playErr) => {
        console.warn('Autoplay did not start immediately:', playErr);
      });
    };

    videoElement.play().catch(() => {});
  }, []);

  // Synchronize stream with video ref
  useEffect(() => {
    if (videoRef.current && stream) {
      attachStreamToVideo(videoRef.current, stream);
    }
  }, [stream, isCameraActive, attachStreamToVideo]);

  // Start webcam with robust fallback cascade
  const startCamera = async (deviceIdToUse?: string) => {
    setCameraError(null);
    setIsConnecting(true);

    // Stop existing tracks first
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    try {
      let mediaStream: MediaStream | null = null;

      // Strategy 1: Ideal HD constraints
      try {
        const constraints: MediaStreamConstraints = {
          video: deviceIdToUse
            ? { deviceId: { exact: deviceIdToUse } }
            : {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 960 },
              },
          audio: false,
        };
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (firstErr) {
        console.warn('Ideal camera constraints failed, attempting fallback to simple video...', firstErr);
        // Strategy 2: Simple fallback { video: true } (widely compatible across all browsers/webcams)
        const fallbackConstraints: MediaStreamConstraints = {
          video: deviceIdToUse ? { deviceId: deviceIdToUse } : true,
          audio: false,
        };
        mediaStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
      }

      if (!mediaStream) {
        throw new Error('Aliran video tidak dapat dimulakan.');
      }

      setStream(mediaStream);
      setIsCameraActive(true);

      // Attempt immediate attach if ref already exists
      if (videoRef.current) {
        attachStreamToVideo(videoRef.current, mediaStream);
      }

      await getCameraDevices();
    } catch (err: any) {
      console.error('Kamera gagal diakses:', err);
      let message = 'Tidak dapat mengakses kamera. Sila pastikan kebenaran kamera dibenarkan dalam penyemak imbas anda.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Akses kamera telah disekat atau ditolak. Sila klik ikon kunci / kamera di sebelah alamat web (URL) dan pilih "Allow" / "Benarkan", kemudian tekan "Aktifkan Kamera" semula.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'Tiada perkakasan webcam dikesan pada komputer ini. Sila pasangkan webcam USB atau gunakan butang muat naik foto.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        message = 'Kamera sedang digunakan oleh aplikasi lain (seperti Zoom, Teams, Google Meet, atau tab penyemak imbas lain). Sila tutup aplikasi tersebut dan cuba lagi.';
      } else if (err.name === 'OverconstrainedError') {
        message = 'Kamera tidak menyokong tetapan resolusi yang diminta. Sila tekan butang aktifkan semula untuk mod serasi automatik.';
      }
      setCameraError(message);
      setIsCameraActive(false);
    } finally {
      setIsConnecting(false);
    }
  };

  // Stop webcam
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
    setVideoResolution(null);
  }, [stream]);

  // Try auto-starting camera if no photo captured yet
  useEffect(() => {
    if (!savedPhoto && !isCameraActive && !cameraError) {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

  // Countdown timer for capturing photo
  const triggerCapture = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 200);
      snapPhoto();
      setCountdown(null);
    }
  }, [countdown]);

  const snapPhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    const vw = video.videoWidth || 1280;
    const vh = video.videoHeight || 960;

    let targetWidth = vw;
    let targetHeight = vh;
    let startX = 0;
    let startY = 0;

    if (aspectRatio === '1:1') {
      const size = Math.min(vw, vh);
      targetWidth = size;
      targetHeight = size;
      startX = (vw - size) / 2;
      startY = (vh - size) / 2;
    } else {
      const widthByRatio = (vh * 3) / 4;
      if (widthByRatio <= vw) {
        targetWidth = widthByRatio;
        targetHeight = vh;
        startX = (vw - widthByRatio) / 2;
        startY = 0;
      } else {
        const heightByRatio = (vw * 4) / 3;
        targetWidth = vw;
        targetHeight = heightByRatio;
        startX = 0;
        startY = (vh - heightByRatio) / 2;
      }
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, startX, startY, targetWidth, targetHeight, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedPhoto(dataUrl);
    stopCamera();
  };

  // Upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCapturedPhoto(result);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera(selectedDeviceId);
  };

  const handleConfirmUse = () => {
    if (capturedPhoto) {
      onPhotoCaptured(capturedPhoto);
    }
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 flex flex-col justify-center">
      {/* Step Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="kiosk-btn flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Langkah 2: Ambil Gambar Wajah Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Lihat tepat ke arah kamera dan senyum dengan ceria!
          </p>
        </div>

        <div className="w-20 hidden sm:block" />
      </div>

      {/* Main View Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-4 sm:p-6 mb-4">
        {/* If photo is already captured -> Preview Screen */}
        {capturedPhoto ? (
          <div className="flex flex-col items-center">
            <div className="relative rounded-2xl overflow-hidden border-4 border-blue-500 shadow-2xl max-w-sm sm:max-w-md w-full aspect-square bg-slate-900 flex items-center justify-center">
              <img
                src={capturedPhoto}
                alt="Foto Murid"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Foto Berjaya Ditangkap</span>
              </div>
            </div>

            {/* Actions for captured photo */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 w-full max-w-lg">
              <button
                onClick={handleRetake}
                className="kiosk-btn flex-1 min-w-[160px] py-3.5 px-5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm sm:text-base rounded-2xl border-2 border-slate-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span>AMBIL SEMULA</span>
              </button>

              <button
                onClick={handleConfirmUse}
                className="kiosk-btn flex-1 min-w-[180px] py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span>GUNAKAN GAMBAR INI</span>
              </button>
            </div>
          </div>
        ) : (
          /* Live Webcam or Camera Activation Area */
          <div className="flex flex-col items-center">
            {/* Always keep video DOM mounted when camera is active or connecting */}
            <div className={`relative w-full max-w-lg mx-auto ${isCameraActive ? 'block' : 'hidden'}`}>
              {/* Flash white animation */}
              {isFlashing && (
                <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-200 pointer-events-none rounded-2xl" />
              )}

              {/* Countdown Overlay */}
              {countdown !== null && countdown > 0 && (
                <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center rounded-2xl">
                  <span className="text-8xl font-black text-amber-400 animate-ping">
                    {countdown}
                  </span>
                  <span className="text-lg font-bold text-white mt-4 bg-slate-950/70 px-4 py-1.5 rounded-full">
                    Senyum! 😊
                  </span>
                </div>
              )}

              {/* Video container */}
              <div
                className={`relative rounded-2xl overflow-hidden bg-black shadow-inner flex items-center justify-center ${
                  aspectRatio === '1:1' ? 'aspect-square' : 'aspect-[3/4]'
                }`}
              >
                <video
                  ref={(node) => {
                    videoRef.current = node;
                    if (node && stream) {
                      attachStreamToVideo(node, stream);
                    }
                  }}
                  playsInline
                  autoPlay
                  muted
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isMirrored ? 'scale-x-[-1]' : ''
                  }`}
                />

                {/* Face Framing Guide Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-[68%] h-[75%] border-2 border-dashed border-white/70 rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] relative flex items-center justify-center">
                    <div className="w-8 h-0.5 bg-amber-400/80 absolute top-1/3" />
                    <div className="w-8 h-0.5 bg-amber-400/80 absolute bottom-1/3" />
                    <div className="h-8 w-0.5 bg-amber-400/80 absolute" />
                  </div>

                  <div className="absolute top-3 bg-slate-950/75 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1.5 border border-white/20">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pastikan wajah di dalam bulatan bujur</span>
                  </div>

                  {videoResolution && (
                    <div className="absolute bottom-3 bg-black/50 text-white/80 text-[10px] font-mono px-2 py-0.5 rounded-md">
                      {videoResolution.width} × {videoResolution.height}px
                    </div>
                  )}
                </div>
              </div>

              {/* Controls Bar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMirrored(!isMirrored)}
                    title="Cermin Kamera"
                    className={`kiosk-btn px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-colors ${
                      isMirrored
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                    <span>Cermin: {isMirrored ? 'Ya' : 'Tidak'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatio(aspectRatio === '1:1' ? '3:4' : '1:1')}
                    title="Nisbah Aspek"
                    className="kiosk-btn px-3 py-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <span>Nisbah: {aspectRatio}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {availableDevices.length > 1 && (
                    <select
                      value={selectedDeviceId}
                      onChange={(e) => {
                        setSelectedDeviceId(e.target.value);
                        startCamera(e.target.value);
                      }}
                      className="text-xs bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-slate-700 max-w-[150px] truncate"
                    >
                      {availableDevices.map((d, i) => (
                        <option key={d.deviceId || i} value={d.deviceId}>
                          {d.label || `Kamera ${i + 1}`}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    onClick={() => startCamera(selectedDeviceId)}
                    title="Sambung semula webcam"
                    className="kiosk-btn p-1.5 text-slate-600 hover:text-blue-700 bg-white border border-slate-200 rounded-xl"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Big Capture Buttons */}
              <div className="mt-5 flex items-center justify-center gap-4">
                <button
                  onClick={triggerCapture}
                  disabled={countdown !== null}
                  className="kiosk-btn px-8 py-4 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-extrabold text-lg sm:text-xl rounded-2xl shadow-xl flex items-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  <Camera className="w-6 h-6 animate-bounce" />
                  <span>AMBIL GAMBAR (3s)</span>
                </button>

                <button
                  onClick={snapPhoto}
                  disabled={countdown !== null}
                  className="kiosk-btn px-5 py-4 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Terus Tangkap</span>
                </button>
              </div>
            </div>

            {/* When Camera is Not Active or Failed */}
            {!isCameraActive && (
              <div className="text-center py-6 px-4 max-w-md w-full">
                <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
                  {isConnecting ? (
                    <RefreshCw className="w-10 h-10 animate-spin text-blue-600" />
                  ) : (
                    <Camera className="w-10 h-10" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isConnecting ? 'Menghubungkan ke Webcam...' : 'Sedia untuk Bergambar?'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                  {isConnecting
                    ? 'Sila tunggu sebentar sementara sistem memulakan perkakasan kamera anda.'
                    : 'Tekan butang di bawah untuk menghidupkan webcam. Jika penyemak imbas meminta kebenaran, sila klik "Allow" / "Benarkan".'}
                </p>

                {cameraError && (
                  <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-left flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <p className="font-bold text-amber-800 mb-0.5">Perhatian Webcam:</p>
                      <p className="mb-2">{cameraError}</p>
                      <p className="text-[11px] text-amber-700 bg-amber-100/70 p-2 rounded-lg font-medium">
                        💡 <strong>Tip Penyelesaian:</strong> Pastikan tiada aplikasi lain seperti Zoom / Meet sedang menggunakan kamera, atau gunakan butang muat naik gambar di bawah.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => startCamera(selectedDeviceId)}
                    disabled={isConnecting}
                    className="kiosk-btn w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    <Video className="w-5 h-5" />
                    <span>{isConnecting ? 'SEDANG MEMULAKAN...' : 'AKTIFKAN KAMERA SEKARANG'}</span>
                  </button>

                  <div className="relative my-2 flex items-center justify-center">
                    <span className="w-full border-t border-slate-200" />
                    <span className="bg-white px-3 text-xs font-bold text-slate-400 absolute">
                      ATAU
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="kiosk-btn w-full py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl border-2 border-slate-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>MUAT NAIK GAMBAR DARI KOMPUTER</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helpful Lighting and Pose Guidance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600">
          <Sun className="w-4 h-4 text-amber-500 shrink-0" />
          <span><strong>Pencahayaan Terang:</strong> Elakkan bayang gelap pada bahagian muka.</span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600">
          <Eye className="w-4 h-4 text-blue-500 shrink-0" />
          <span><strong>Pandang Kamera:</strong> Paras mata sejajar dengan lensa webcam.</span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600">
          <Sparkles className="w-4 h-4 text-red-500 shrink-0" />
          <span><strong>Senyuman Manis:</strong> Senyuman ceria menjadikan avatar 3D lebih memikat!</span>
        </div>
      </div>
    </div>
  );
};
