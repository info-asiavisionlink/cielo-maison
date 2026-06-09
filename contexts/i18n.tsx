"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import en from "../messages/en.json";
import jp from "../messages/jp.json";
import fr from "../messages/fr.json";
import cn from "../messages/cn.json";
import th from "../messages/th.json";

export type Locale = "JP" | "EN" | "FR" | "CN" | "TH";
export type Messages = typeof en;

const messages: Record<Locale, Messages> = {
  EN: en,
  JP: jp as Messages,
  FR: fr as Messages,
  CN: cn as Messages,
  TH: th as Messages,
};

interface I18nCtx {
  locale: Locale;
  t: Messages;
  setLocale: (l: Locale) => void;
}

const I18nContext = createContext<I18nCtx>({
  locale: "JP",
  t: jp as Messages,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("JP");
  return (
    <I18nContext.Provider value={{ locale, t: messages[locale], setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
