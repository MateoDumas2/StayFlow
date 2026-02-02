import { cookies } from 'next/headers';
import es from './locales/es.json';
import en from './locales/en.json';

const resources = {
  es,
  en
};

export async function useTranslation() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('i18next')?.value || 'es';
  const locale = resources[lang as keyof typeof resources] || resources.es;

  const t = (key: string, params?: any) => {
    const keys = key.split('.');
    let value: any = locale;
    
    for (const k of keys) {
      if (value === undefined || value === null) break;
      value = value[k];
    }
    
    if (value === undefined || value === null) return key;
    
    if (typeof value === 'string' && params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(`{{${k}}}`, String(v));
      });
    }
    
    return value;
  };

  return { t, i18n: { language: lang } };
}
