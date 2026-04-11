/**
 * Organization: SaaS Core Type definitions
 * Strictly modularized structure: model, request, response, result, data, context, auth
 */

// Auth
export * from "@/types/auth/jwt-payload.type";

// Context
export * from "@/types/context/auth-context.type";

// Data (Page/Domain models)
export * from "@/types/data/github-profile.type";
export * from "@/types/data/market-data.type";
export * from "@/types/data/market-price-entry.type";
export * from "@/types/data/season.type";
export * from "@/types/data/state.type";
export * from "@/types/data/weather-data.type";

// Model (Database Table Entities)
export * from "@/types/model/crop-prediction.type";
export * from "@/types/model/crop.type";
export * from "@/types/model/new-crop-prediction.type";
export * from "@/types/model/new-role-model.type";
export * from "@/types/model/new-soil.type";
export * from "@/types/model/new-stock.type";
export * from "@/types/model/new-user-role.type";
export * from "@/types/model/new-user.type";
export * from "@/types/model/role-model.type";
export * from "@/types/model/role-type.type";
export * from "@/types/model/soil.type";
export * from "@/types/model/stock.type";
export * from "@/types/model/user-role.type";
export * from "@/types/model/user.type";
export * from "@/types/model/worker.type";

// Request (API Request Payloads)
export * from "@/types/request/chat-request.type";
export * from "@/types/request/pest-form-data.type";
export * from "@/types/request/pest-prediction-request.type";
export * from "@/types/request/soil-health-input.type";

// Response (API Response Payloads)
export * from "@/types/response/action-response.type";
export * from "@/types/response/api-error-code.type";
export * from "@/types/response/api-error-message.type";
export * from "@/types/response/api-error-response.type";
export * from "@/types/response/api-error.type";
export * from "@/types/response/api-response-payload.type";
export * from "@/types/response/chat-response.type";
export * from "@/types/response/pagination.type";
export * from "@/types/response/pest-prediction-response.type";
export * from "@/types/response/pest-prediction-result.type";
export * from "@/types/response/prediction-response.type";

// Result (Computation/Chat Output)
export * from "@/types/result/chatbot-message.type";
export * from "@/types/result/chatbot-user.type";

// Props (Component communication)
export * from "@/types/props/dashboard/role-stat.type";
export * from "@/types/props/dashboard/admin-dashboard-props.type";
export * from "@/types/props/dashboard/farmer-dashboard-props.type";
export * from "@/types/props/dashboard/worker-dashboard-props.type";
export * from "@/types/props/price.type";

// Constants (Exposed via types for convenience)
export { ROLE } from "@/lib/constants/role";
