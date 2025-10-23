import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type DecodedToken = {
  id: string;
  role: 'ADMIN' | 'MENTOR' | 'MEMBER';
  email?: string;
  name?: string | null;
  iat: number;
  exp: number;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: 'JWT secret not configured' });
  }

  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
