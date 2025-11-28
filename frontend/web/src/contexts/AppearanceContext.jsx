'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppearanceContext = createContext(undefined);

export function AppearanceProvider({ children }) {
  const [theme, setTheme] = useState('dark'); // Padrão: dark
  const [selectedFontSize, setSelectedFontSize] = useState('text-base'); // Padrão: text-base

  // Efeito para carregar preferências do localStorage na montagem inicial
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }

    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      setSelectedFontSize(savedFontSize);
    }
  }, []);

  // Efeito para aplicar as classes CSS ao document.documentElement
  // Este efeito roda sempre que theme ou selectedFontSize mudam no CONTEXTO
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');

    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    document.documentElement.classList.add(selectedFontSize);
  }, [theme, selectedFontSize]);

  // Função para atualizar as preferências e salvá-las no localStorage
  const applyPreferences = useCallback((newTheme, newFontSize) => {
    setTheme(newTheme);
    setSelectedFontSize(newFontSize);
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('fontSize', newFontSize);
  }, []);

  const value = React.useMemo(() => ({
    theme,
    selectedFontSize,
    applyPreferences,
  }), [theme, selectedFontSize, applyPreferences]);

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
}

