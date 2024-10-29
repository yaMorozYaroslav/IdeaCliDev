import {createSharedPathnamesNavigation} from 'next-intl/navigation';
 
export const locales = ['en', 'ua', 'ru'] as const;
//~ export const localePrefix = 'ua'; // Default
export const localePrefix = 'always';
 
export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation({locales, localePrefix});
