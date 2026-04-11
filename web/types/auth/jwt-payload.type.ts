/**
 * JWT Payload structure for authentication
 */
export interface JwtPayload {
    id: number;
    email: string;
    role?: string;
}
