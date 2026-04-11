/**
 * Server-only Library barrel
 * ⚠️  NEVER import this in 'use client' files.
 *     Only used by: API routes (app/api/**), services/, middleware.
 */

// Server-side API handling
export * from "@/lib/api/response";

// Auth utils (jwt + bcrypt — Node.js only)
export * from "@/lib/auth";

// CORS handling (NextResponse — server only)
export * from "@/lib/cors";

// Database client (pg — Node.js only)
export * from "@/lib/drizzle";

// Server-side exceptions
export * from "@/lib/exception/api-exception";
export * from "@/lib/exception/error-exception";

// LLM engine (Xenova/transformers — server only)
export * from "@/lib/llm-engine";
