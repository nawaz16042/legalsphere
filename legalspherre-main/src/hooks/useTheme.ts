
"use client";

import { useContext } from 'react';
import { ThemeProvider, useTheme as useNextTheme } from '@/contexts/ThemeContext';

export const useTheme = () => {
  const context = useNextTheme();
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
