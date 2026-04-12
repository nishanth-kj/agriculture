/**
 * Client-safe Library barrel
 * ⚠️  Do NOT add server-only modules here (drizzle, auth, cors, llm-engine, api/response).
 *     Those live in @/lib/server and are only imported by API routes / services.
 */

// Client-side API helpers
export * from "@/lib/api/api";
export * from "@/lib/api/apiclient";

// Shared constants (pure data — no Node.js APIs)
export * from "@/lib/constants/auth";
export * from "@/lib/constants/crops";
export * from "@/lib/constants/crop-suggestions";
export * from "@/lib/constants/external-api";
export * from "@/lib/constants/growth-stages";
export * from "@/lib/constants/http";
export * from "@/lib/constants/role";
export * from "@/lib/constants/seasons";
export * from "@/lib/constants/states";
export * from "@/lib/constants/status";
export * from "@/lib/constants/weather-options";

// Shared utilities & enums
export * from "@/lib/enum/base-enum";
export * from "@/lib/enum/enum-item.type";
export * from "@/lib/utils";
export * from "@/lib/models/pagination.model";
