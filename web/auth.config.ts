import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
            }
            return token
        },
        session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string
                // @ts-ignore - Role is not in default session type yet
                session.user.role = token.role as string
            }
            return session
        },
    },
    providers: [], // Configured in auth.ts
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig
