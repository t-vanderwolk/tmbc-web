import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import type { Role } from '../types/roles';
import { isRole } from '../types/roles';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      role: Role;
    };
  }
}

const parseCookieToken = (cookieHeader?: string): string | undefined => {
  if (!cookieHeader) {
    return undefined;
  }

  const tokenCookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('token='));

  if (!tokenCookie) {
    return undefined;
  }

  return decodeURIComponent(tokenCookie.split('=')[1] ?? '');
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.substring('Bearer '.length)
    : undefined;

  const cookieToken = parseCookieToken(req.headers.cookie);
  const token = bearerToken ?? cookieToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: 'JWT secret not configured' });
  }

  try {
    const decoded = jwt.verify(token, secret) as { id?: string; role?: string };

    if (!decoded.id || !isRole(decoded.role)) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
