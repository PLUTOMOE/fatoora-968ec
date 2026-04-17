import { useStore } from '@/store/useStore';
import { ar } from '@/i18n/ar';
import { en } from '@/i18n/en';

type Dictionary = typeof ar;

export function useTranslation() {
  const { language } = useStore();

  const getTranslation = (path: string) => {
    const keys = path.split('.');
    let current: any = language === 'ar' ? ar : en;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation key missing: ${path}`);
        return path;
      }
      current = current[key];
    }
    
    return current;
  };

  return {
    t: getTranslation,
    lang: language
  };
}
