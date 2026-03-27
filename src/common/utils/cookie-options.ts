import { CookieOptions } from 'express';

export function buildAuthCookieOptions(maxAge: number): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieDomain = process.env.COOKIE_DOMAIN;
  const sameSiteEnv = process.env.COOKIE_SAMESITE?.toLowerCase();

  const sameSite: CookieOptions['sameSite'] =
    sameSiteEnv === 'none' || sameSiteEnv === 'lax' || sameSiteEnv === 'strict'
      ? sameSiteEnv
      : isProduction
        ? 'none'
        : 'lax';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    maxAge,
    path: '/',
    ...(cookieDomain ? { domain: cookieDomain } : {}),
  };
}
