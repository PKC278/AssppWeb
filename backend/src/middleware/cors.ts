import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

function isAllowedOrigin(origin: string): boolean {
  return config.corsOrigins.includes(origin);
}

export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const origin = req.headers.origin;
  const hasOrigin = typeof origin === "string" && origin.length > 0;
  const allowed = hasOrigin && isAllowedOrigin(origin);

  if (allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,DELETE,OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type,X-Access-Token",
    );
    res.setHeader("Access-Control-Max-Age", "86400");
  }

  if (req.method === "OPTIONS") {
    if (hasOrigin && !allowed) {
      res.status(403).json({ error: "CORS origin denied" });
      return;
    }
    res.sendStatus(204);
    return;
  }

  next();
}
