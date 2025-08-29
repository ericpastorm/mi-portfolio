// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// El idioma por defecto de tu web
const defaultLocale = 'es';

export function middleware(request: NextRequest) {
  // Redirige la ruta raíz ("/") a la ruta del idioma por defecto (ej: "/es").
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
}

// Configuración para que el middleware solo se ejecute en las páginas
// y no en archivos estáticos como imágenes o CSS.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};