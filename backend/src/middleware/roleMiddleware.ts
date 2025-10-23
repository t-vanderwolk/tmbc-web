import { NextFunction, Request, Response } from 'express';

type Role = 'ADMIN' | 'MENTOR' | 'MEMBER';

export const requireRole = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
