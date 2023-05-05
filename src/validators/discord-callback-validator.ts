import { NextFunction, Request, Response } from 'express';
import { HttpCodes } from '../exceptions/custom-error';

export const DiscordCallbackValidator = (req: Request, res: Response, next: NextFunction) => {
  const code = req.body as string;

  if (!code) {
    res.status(HttpCodes.BAD_REQUEST).json({ error: 'Code is missing' });
    return;
  }

  if (code.length < 8 || code.length >= 9) {
    res.status(HttpCodes.BAD_REQUEST).json({ error: 'Invalid code format' });
    return;
  }

  next();
};
