import { EnumDefinition, EnumItem } from "@/lib";

/**
 * Standardized API Error Messages
 */
export const ApiErrorMessage: EnumDefinition<
    "VALIDATION_ERROR" |
    "AUTHENTICATION_ERROR" |
    "FORBIDDEN_ERROR" |
    "NOT_FOUND_ERROR" |
    "INTERNAL_SERVER_ERROR" |
    "BAD_REQUEST_ERROR" |
    "INVALID_CREDENTIALS" |
    "EMAIL_IN_USE" |
    "MISSING_FIELDS" |
    "UNAUTHORIZED"
> = {
    VALIDATION_ERROR: new EnumItem(400, "The provided data is invalid."),
    AUTHENTICATION_ERROR: new EnumItem(401, "Authentication is required to access this resource."),
    FORBIDDEN_ERROR: new EnumItem(403, "You do not have permission to perform this action."),
    NOT_FOUND_ERROR: new EnumItem(404, "The requested resource was not found."),
    INTERNAL_SERVER_ERROR: new EnumItem(500, "An unexpected error occurred on the server."),
    BAD_REQUEST_ERROR: new EnumItem(400, "The request could not be processed."),
    INVALID_CREDENTIALS: new EnumItem(401, "Invalid email or password."),
    EMAIL_IN_USE: new EnumItem(400, "This email is already registered."),
    MISSING_FIELDS: new EnumItem(400, "Please fill in all required fields."),
    UNAUTHORIZED: new EnumItem(401, "Unauthorized access.")
};

/**
 * Export a type for the codes themselves for type safety in other files
 */
export type ApiErrorMessageKey = keyof typeof ApiErrorMessage;
