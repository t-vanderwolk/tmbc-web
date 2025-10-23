import jwt from 'jsonwebtoken';

type TokenPayload = {
  id: string;
  role: 'ADMIN' | 'MENTOR' | 'MEMBER';
};

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }

  return jwt.sign(payload, secret, { expiresIn: '7d' });
};
