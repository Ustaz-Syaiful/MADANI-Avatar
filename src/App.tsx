/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { StepProgressBar } from './components/StepProgressBar';
import { WelcomeStep } from './components/WelcomeStep';
import { CameraStep } from './components/CameraStep';
import { StyleSelectorStep } from './components/StyleSelectorStep';
import { GenerationStep } from './components/GenerationStep';
import { CardDesignerStep } from './components/CardDesignerStep';
import { AdminModal } from './components/AdminModal';
import { PrivacyNoticeModal } from './components/PrivacyNoticeModal';
import { TimeoutWarningModal } from './components/TimeoutWarningModal';
import { AVATAR_STYLES, DEFAULT_KIOSK_CONFIG } from './constants';
import { AppStep, AvatarStyle, KioskConfig } from './types';

export default function App() {
  // App Step State
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');

  // Photo & Avatar State
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string>('hero');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [avatarResult, setAvatarResult] = useState<string | null>(null);

  // Generation Loading & Error State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationErrorDetails, setGenerationErrorDetails] = useState<string | null>(null);
  const [generationTimeMs, setGenerationTimeMs] = useState<number | undefined>(undefined);
  const [aiCharacterTitle, setAiCharacterTitle] = useState<string | null>(null);

  // Kiosk Configuration State (persisted in localStorage)
  const [config, setConfig] = useState<KioskConfig>(() => {
    try {
      const saved = localStorage.getItem('madani_avatar_kiosk_config');
      return saved ? JSON.parse(saved) : DEFAULT_KIOSK_CONFIG;
    } catch {
      return DEFAULT_KIOSK_CONFIG;
    }
  });

  // Modals & Fullscreen State
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Kiosk Session Timer
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(config.sessionTimeoutSeconds);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState<boolean>(false);

  // Active session flag (user has started interacting)
  const hasActiveSession = currentStep !== 'welcome' || Boolean(userPhoto || avatarResult);

  // Reset/Clear Session
  const handleResetSession = useCallback(() => {
    setUserPhoto(null);
    setAvatarResult(null);
    setSelectedStyleId('hero');
    setCustomNotes('');
    setAiCharacterTitle(null);
    setGenerationError(null);
    setGenerationErrorDetails(null);
    setIsGenerating(false);
    setCurrentStep('welcome');
    setShowTimeoutWarning(false);
    setSessionTimeLeft(config.sessionTimeoutSeconds);
  }, [config.sessionTimeoutSeconds]);

  // Extend Session Timer
  const handleExtendSession = useCallback(() => {
    setSessionTimeLeft(config.sessionTimeoutSeconds);
    setShowTimeoutWarning(false);
  }, [config.sessionTimeoutSeconds]);

  // Session Activity Listener & Countdown
  useEffect(() => {
    if (!hasActiveSession) {
      setSessionTimeLeft(config.sessionTimeoutSeconds);
      setShowTimeoutWarning(false);
      return;
    }

    // Do not countdown or timeout while actively generating with AI!
    if (isGenerating) {
      return;
    }

    const interval = setInterval(() => {
      setSessionTimeLeft((prev) => {
        if (prev <= 1) {
          handleResetSession();
          return config.sessionTimeoutSeconds;
        }
        if (prev === 21) {
          setShowTimeoutWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasActiveSession, isGenerating, config.sessionTimeoutSeconds, handleResetSession]);

  // Reset inactivity timer on interaction (only if not already in warning modal)
  const resetInactivity = useCallback(() => {
    if (hasActiveSession && !showTimeoutWarning && !isGenerating) {
      setSessionTimeLeft(config.sessionTimeoutSeconds);
    }
  }, [hasActiveSession, showTimeoutWarning, isGenerating, config.sessionTimeoutSeconds]);

  useEffect(() => {
    window.addEventListener('click', resetInactivity);
    window.addEventListener('touchstart', resetInactivity);
    return () => {
      window.removeEventListener('click', resetInactivity);
      window.removeEventListener('touchstart', resetInactivity);
    };
  }, [resetInactivity]);

  // Save updated config
  const handleSaveConfig = (newConfig: KioskConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('madani_avatar_kiosk_config', JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Unable to persist config to localStorage');
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Call real AI image generation API
  const generateAvatarWithAI = async (photoToUse: string, styleId: string, notes?: string) => {
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationErrorDetails(null);
    setCurrentStep('generating');

    const startTime = Date.now();

    try {
      const response = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: photoToUse,
          mimeType: 'image/jpeg',
          styleId,
          customNotes: notes || '',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setGenerationError(data.error || 'Penjanaan avatar AI gagal.');
        setGenerationErrorDetails(data.errorDetails || `Status HTTP: ${response.status}`);
        setIsGenerating(false);
        return;
      }

      setAvatarResult(data.imageUrl);
      setAiCharacterTitle(data.aiTitle || null);
      setGenerationTimeMs(data.generationTimeMs || Date.now() - startTime);
      setIsGenerating(false);
    } catch (error: any) {
      console.error('Error generating avatar:', error);
      setGenerationError(
        'Tidak dapat berhubung dengan perkhidmatan AI. Sila periksa sambungan internet kiosk anda.'
      );
      setGenerationErrorDetails(String(error));
      setIsGenerating(false);
    }
  };

  // Find active style object
  const currentStyleObject: AvatarStyle =
    AVATAR_STYLES.find((s) => s.id === selectedStyleId) || AVATAR_STYLES[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header
        config={config}
        timeLeft={sessionTimeLeft}
        onResetSession={handleResetSession}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        hasActiveSession={hasActiveSession}
      />

      {/* Step Progress Bar (Hidden on welcome screen for cleaner arrival) */}
      {currentStep !== 'welcome' && (
        <StepProgressBar
          currentStep={currentStep}
          canNavigateBack={!isGenerating}
        />
      )}

      {/* Main Step Router */}
      <main className="flex-1 flex flex-col justify-center py-4">
        {currentStep === 'welcome' && (
          <WelcomeStep
            config={config}
            onStart={() => setCurrentStep('camera')}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />
        )}

        {currentStep === 'camera' && (
          <CameraStep
            savedPhoto={userPhoto}
            onPhotoCaptured={(photoUrl) => {
              setUserPhoto(photoUrl);
              setCurrentStep('style');
            }}
            onBack={() => setCurrentStep('welcome')}
          />
        )}

        {currentStep === 'style' && userPhoto && (
          <StyleSelectorStep
            userPhoto={userPhoto}
            selectedStyleId={selectedStyleId}
            onSelectStyle={(id, notes) => {
              setSelectedStyleId(id);
              if (notes !== undefined) setCustomNotes(notes);
            }}
            onBack={() => setCurrentStep('camera')}
            onProceedToGenerate={(styleId, notes) => {
              setSelectedStyleId(styleId);
              if (notes) setCustomNotes(notes);
              generateAvatarWithAI(userPhoto, styleId, notes);
            }}
          />
        )}

        {currentStep === 'generating' && userPhoto && (
          <GenerationStep
            userPhoto={userPhoto}
            avatarResult={avatarResult}
            style={currentStyleObject}
            isGenerating={isGenerating}
            error={generationError}
            errorDetails={generationErrorDetails}
            generationTimeMs={generationTimeMs}
            onRegenerate={() => generateAvatarWithAI(userPhoto, selectedStyleId, customNotes)}
            onChangeStyle={() => setCurrentStep('style')}
            onProceedToDesign={() => setCurrentStep('design')}
            onBackToCamera={() => setCurrentStep('camera')}
          />
        )}

        {currentStep === 'design' && avatarResult && userPhoto && (
          <CardDesignerStep
            avatarUrl={avatarResult}
            userPhoto={userPhoto}
            style={currentStyleObject}
            config={config}
            aiTitle={aiCharacterTitle}
            onResetAndStartNew={handleResetSession}
            onBackToEdit={() => setCurrentStep('generating')}
          />
        )}
      </main>

      {/* Kiosk Footer (no-print) */}
      <footer className="no-print w-full py-2.5 px-4 bg-white/75 backdrop-blur-xs border-t border-slate-200 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Kiosk Aktif: {config.programName}</span>
          <span className="text-slate-300">·</span>
          <span>{config.districtName}</span>
        </div>

        <p className="text-[11px] text-slate-500">
          Dikuasakan oleh Google Gemini AI · Rekaan Khas Acara Karnival MADANI Sekolah
        </p>
      </footer>

      {/* Modals */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />

      <PrivacyNoticeModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <TimeoutWarningModal
        isOpen={showTimeoutWarning}
        timeLeft={sessionTimeLeft}
        onExtendSession={handleExtendSession}
        onFinishNow={handleResetSession}
      />
    </div>
  );
}
