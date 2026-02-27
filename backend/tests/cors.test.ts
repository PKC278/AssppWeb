import { describe, it, expect } from "vitest";
import type { NextFunction, Request, Response } from "express";
import { config } from "../src/config.js";
import { corsMiddleware } from "../src/middleware/cors.js";

function createMockReq(
  method: string,
  origin?: string,
): Request {
  return {
    method,
    headers: origin ? { origin } : {},
  } as unknown as Request;
}

function createMockRes() {
  const headers: Record<string, string> = {};
  let statusCode = 200;
  let jsonBody: unknown = undefined;
  let sentStatus: number | null = null;

  const res = {
    setHeader: (name: string, value: string) => {
      headers[name] = value;
      return res;
    },
    status: (code: number) => {
      statusCode = code;
      return res;
    },
    json: (body: unknown) => {
      jsonBody = body;
      return res;
    },
    sendStatus: (code: number) => {
      sentStatus = code;
      statusCode = code;
      return res;
    },
  } as unknown as Response;

  return {
    res,
    headers,
    get statusCode() {
      return statusCode;
    },
    get jsonBody() {
      return jsonBody;
    },
    get sentStatus() {
      return sentStatus;
    },
  };
}

describe("corsMiddleware", () => {
  it("should set CORS headers for allowed origin", () => {
    const original = config.corsOrigins;
    config.corsOrigins = ["https://app.example.com"];
    try {
      const req = createMockReq("GET", "https://app.example.com");
      const mock = createMockRes();
      let nextCalled = false;
      const next: NextFunction = () => {
        nextCalled = true;
      };

      corsMiddleware(req, mock.res, next);

      expect(nextCalled).toBe(true);
      expect(mock.headers["Access-Control-Allow-Origin"]).toBe(
        "https://app.example.com",
      );
      expect(mock.headers["Access-Control-Allow-Headers"]).toBe(
        "Content-Type,X-Access-Token",
      );
    } finally {
      config.corsOrigins = original;
    }
  });

  it("should return 204 for OPTIONS with allowed origin", () => {
    const original = config.corsOrigins;
    config.corsOrigins = ["https://app.example.com"];
    try {
      const req = createMockReq("OPTIONS", "https://app.example.com");
      const mock = createMockRes();
      let nextCalled = false;
      const next: NextFunction = () => {
        nextCalled = true;
      };

      corsMiddleware(req, mock.res, next);

      expect(nextCalled).toBe(false);
      expect(mock.sentStatus).toBe(204);
    } finally {
      config.corsOrigins = original;
    }
  });

  it("should deny OPTIONS for disallowed origin", () => {
    const original = config.corsOrigins;
    config.corsOrigins = ["https://app.example.com"];
    try {
      const req = createMockReq("OPTIONS", "https://evil.example.com");
      const mock = createMockRes();
      let nextCalled = false;
      const next: NextFunction = () => {
        nextCalled = true;
      };

      corsMiddleware(req, mock.res, next);

      expect(nextCalled).toBe(false);
      expect(mock.statusCode).toBe(403);
      expect(mock.jsonBody).toEqual({ error: "CORS origin denied" });
    } finally {
      config.corsOrigins = original;
    }
  });
});
