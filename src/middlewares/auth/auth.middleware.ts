import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']
    if (!token) return res.status(401).json({message:'unauthorized'})



      console.log(`User is authnticated with token: ${token}`);
    next();
  }
}
