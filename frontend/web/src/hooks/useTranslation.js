"use client"

import { createContext, useContext, useState, useEffect } from 'react';

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [lang, setLang] = useState('pt-BR');
  const [dict, setDict] = useState({});

  const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/';
  const TRANSLATE_ENDPOINT = `${BACKEND_BASE}translate`;
  // console.log(TRANSLATE_ENDPOINT)

  useEffect(() => {
    const savedLang = localStorage.getItem('idioma') || 'pt-BR';
    setLang(savedLang);
    const savedDict = localStorage.getItem(`translations_${savedLang}`);
    if (savedDict) setDict(JSON.parse(savedDict));
  }, []);

  async function translate(text) {
    if (!text) return text;
    if (lang === 'pt-BR') return text;
    if (dict[text]) return dict[text];

    try {
      const res = await fetch(TRANSLATE_ENDPOINT, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, to: lang }),
      });

      if (!res.ok) return text;

      const data = await res.json();
      const translated = data?.[0]?.translations?.[0]?.text || text;

      const newDict = { ...dict, [text]: translated };
      setDict(newDict);
      localStorage.setItem(`translations_${lang}`, JSON.stringify(newDict));
      return translated;
    } catch (err) {
      console.error(err);
      return text;
    }
  }

  function changeLang(newLang) {
    setLang(newLang);
    localStorage.setItem('idioma', newLang);
    const savedDict = localStorage.getItem(`translations_${newLang}`);
    setDict(savedDict ? JSON.parse(savedDict) : {});
  }

  return (
    <TranslationContext.Provider value={{ lang, changeLang, translate }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
