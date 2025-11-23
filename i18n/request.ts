import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async () => {
  // Static for now
  const locale = 'en';
 
  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default
  };
});