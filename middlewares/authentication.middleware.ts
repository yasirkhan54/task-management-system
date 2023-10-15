import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const accessToken = req.cookies.accessToken as string;

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not found' });
  }

  const secretKey = process.env.SECRET_KEY;

  if (!secretKey) {
    return res.status(401).json({ error: 'Secret key not found' });
  }

  jwt.verify(accessToken, secretKey, (err: unknown, decoded: unknown) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid access token' });
    }

    (req as any).user = decoded;    // Store the user information in the request object
    next();                         // Proceed to the next middleware or route handler
  });
}