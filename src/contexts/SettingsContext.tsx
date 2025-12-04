
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

const SETTINGS_KEY = 'legalsphere_settings';

interface SettingsState {
  voiceMode: boolean;
  fontSize: number;
  highContrast: boolean;
  voiceSpeed: number;
  storeHistory: boolean;
}

const defaultSettings: SettingsState = {
  voiceMode: true,
  fontSize: 16,
  highContrast: false,
  voiceSpeed: 1,
  storeHistory: true,
};

interface SettingsContextType {
  settings: SettingsState;
  setVoiceMode: (value: boolean) => void;
  setFontSize: (value: number) => void;
  setHighContrast: (value: boolean) => void;
  setVoiceSpeed: (value: number) => void;
  setStoreHistory: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage', error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if(isLoaded){
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

            // Apply global styles for font size and high contrast
            document.documentElement.style.fontSize = `${settings.fontSize}px`;
            document.body.classList.toggle('high-contrast', settings.highContrast);

        } catch (error) {
            console.error('Failed to save settings to localStorage', error);
        }
    }
  }, [settings, isLoaded]);

  const setVoiceMode = useCallback((value: boolean) => {
    setSettings(s => ({ ...s, voiceMode: value }));
  }, []);
  const setFontSize = useCallback((value: number) => {
    setSettings(s => ({ ...s, fontSize: value }));
  }, []);
  const setHighContrast = useCallback((value: boolean) => {
    setSettings(s => ({ ...s, highContrast: value }));
  }, []);
  const setVoiceSpeed = useCallback((value: number) => {
    setSettings(s => ({ ...s, voiceSpeed: value }));
  }, []);
  const setStoreHistory = useCallback((value: boolean) => {
    setSettings(s => ({ ...s, storeHistory: value }));
  }, []);


  const value = {
    settings,
    setVoiceMode,
    setFontSize,
    setHighContrast,
    setVoiceSpeed,
    setStoreHistory,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
