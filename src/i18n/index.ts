import { DEFAULT_APP_LOCALE, FALLBACK_APP_LOCALE } from '@/config/app';
import messages from '@/translations';
import { createI18n } from 'vue-i18n';

export const i18n = createI18n({
  locale: DEFAULT_APP_LOCALE,
  fallbackLocale: FALLBACK_APP_LOCALE,
  messages,
});

export const localize = i18n.global.t;
