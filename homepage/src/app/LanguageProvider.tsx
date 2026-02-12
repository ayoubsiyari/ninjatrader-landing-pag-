"use client";

import React from "react";

export type AppLanguage = "en" | "ar";

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  isArabic: boolean;
};

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always Arabic - no localStorage override
  const [language] = React.useState<AppLanguage>("ar");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Clear any old language preference
    try {
      window.localStorage.removeItem("talaria_language");
    } catch {}
  }, []);

  // No-op functions since language is fixed to Arabic
  const setLanguage = React.useCallback((_lang: AppLanguage) => {}, []);
  const toggleLanguage = React.useCallback(() => {}, []);

  const isArabic = language === "ar";

  React.useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [language, isArabic, mounted]);

  const value = React.useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, toggleLanguage, isArabic }),
    [language, setLanguage, toggleLanguage, isArabic]
  );

  return (
    <LanguageContext.Provider value={value}>
      <div className={isArabic ? "font-sans" : "font-sans"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
