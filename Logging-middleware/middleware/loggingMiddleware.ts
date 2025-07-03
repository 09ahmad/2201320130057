import { type NextFunction, type Request, type Response  } from "express";

import fs from 'fs';
import path from 'path';

const logFile = path.join(__dirname, '../../logs/access.log');

function logger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms\n`;
    fs.appendFile(logFile, log, err => {
      if (err) {
        throw new Error("Something went wrong ")
      }
    });
  });
  next();
}

export default logger; 
