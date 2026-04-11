export const AUTH = {
    COOKIE: {
        NAME: 'token',
        MAX_AGE: 60 * 60 * 24 * 7, // 7 days
        PATH: '/',
        SAME_SITE: 'strict' as const,
        SECURE_ENV: 'production',
    },
    JWT: {
        ALGORITHM: 'HS256',
        EXPIRES_IN: '7d',
    }
};

