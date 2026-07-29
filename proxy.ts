// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// El idioma por defecto de tu web
const defaultLocale = 'es';

export default function proxy(request: NextRequest) {
  // Keep the canonical social URL extensionless while serving the static file-based PNG.
  if (request.nextUrl.pathname === '/opengraph-image') {
    return NextResponse.rewrite(new URL('/opengraph-image.png', request.url));
  }

  // Redirige la ruta raíz ("/") a la ruta del idioma por defecto (ej: "/es").
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  const locale = request.nextUrl.pathname.split('/')[1] === 'en' ? 'en' : 'es';
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-site-locale', locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Configuración para que el middleware solo se ejecute en las páginas
// y no en archivos estáticos como imágenes o CSS.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
