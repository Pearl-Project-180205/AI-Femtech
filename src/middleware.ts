import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'ko', 'ja', 'th', 'vi', 'de', 'fr', 'zh-CN', 'zh-TW']
const defaultLocale = 'en'

function getLocale(request: NextRequest) {
  // Option 1: check if we have a cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  // Option 2: Accept-Language
  const acceptLang = request.headers.get('accept-language');
  if (acceptLang) {
     const langs = acceptLang.split(',').map(lang => lang.split(';')[0].trim());
     for (const lang of langs) {
        if (locales.includes(lang)) return lang;
        const prefix = lang.split('-')[0];
        if (locales.includes(prefix)) return prefix;
        // Special mapping for Chinese
        if (lang === 'zh-Hant' || lang === 'zh-TW' || lang === 'zh-HK') return 'zh-TW';
        if (lang === 'zh-Hans' || lang === 'zh-CN' || lang === 'zh') return 'zh-CN';
     }
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|css)$/)
  ) return;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico).*)',
  ],
}
