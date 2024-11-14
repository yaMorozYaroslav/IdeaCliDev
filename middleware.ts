import createMiddleware from 'next-intl/middleware'
import {locales, localePrefix} from './navigation';
 

export default createMiddleware({
  defaultLocale: 'en',
  localeDetection: false,
  localePrefix,
  locales
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ua|en|ru)/:path*']
   //~ matcher: ['/((?!api|_next|.*\\..*).*)']
};
