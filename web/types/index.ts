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
export * from "@/types/data/inventory.type";
export * from "@/types/data/market-data.type";
export * from "@/types/data/market-price-entry.type";
export * from "@/types/data/season.type";
export * from "@/types/data/state.type";
export * from "@/types/data/weather-data.type";
export * from "@/types/data/worker.type";

// Model (Database Table Entities - Interfaces)
export * from "@/types/interfaces/crop-prediction";
export * from "@/types/interfaces/crop";
export * from "@/types/interfaces/new-soil";
export * from "@/types/interfaces/new-stock";
export * from "@/types/interfaces/new-user-role";
export * from "@/types/interfaces/new-user";
export * from "@/types/interfaces/role-model";
export * from "@/types/interfaces/role-type";
export * from "@/types/interfaces/soil";
export * from "@/types/interfaces/stock";
export * from "@/types/interfaces/user-role";
export * from "@/types/interfaces/user";
export * from "@/types/interfaces/worker";

// Request (API Request Payloads)
export * from "@/types/request/chat-request.type";
export * from "@/types/request/inventory-form.type";
export * from "@/types/request/pest-form-data.type";
export * from "@/types/request/pest-prediction-request.type";
export * from "@/types/request/soil-health-input.type";
export * from "@/types/request/worker-form.type";
export * from "@/types/request/login-request.type";
export * from "@/types/request/register-request.type";

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
export * from "@/types/response/inventory-api-item.type";
export * from "@/types/response/worker-api-item.type";

// Result (Computation/Chat Output)
export * from "@/types/result/chatbot-message.type";
export * from "@/types/result/chatbot-user.type";

// Props (Component communication)
export * from "@/types/props/dashboard/role-stat.type";
export * from "@/types/props/dashboard/dashboard-layout-props.type";
export * from "@/types/props/dashboard/admin-dashboard-props.type";
export * from "@/types/props/dashboard/farmer-dashboard-props.type";
export * from "@/types/props/dashboard/worker-dashboard-props.type";
export * from "@/types/props/dashboard/sidebar-props.type";
export * from "@/types/props/dashboard/sidebar-base-props.type";
export * from "./props/dashboard/sidebar-item-props.type";
export * from "./props/dashboard/soil-health-props.type";
export * from "./props/dashboard/crop-prediction-props.type";
export * from "@/types/props/dashboard/pest-prediction-props.type";
export * from "@/types/props/price.type";

// Constants (Exposed via types for convenience)
export { ROLE } from "@/lib/constants/role";
export { STATUS } from "@/lib/constants/status";
