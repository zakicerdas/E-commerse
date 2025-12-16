import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      startTime?: number;
      apiKey?: string;

      user?: {
        id: number;
        role: string;
      } | JwtPayload;
    }
  }
}

export {};