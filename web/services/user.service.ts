import { comparePassword, generateToken, hashPassword, AuthException, ValidationException, NotFoundException } from '@/lib/server';
import { ROLE, STATUS } from '@/lib';
import { NewUser, User, ApiErrorCode } from '@/types';
import { eq, or, sql, count } from "drizzle-orm";
import db from '@/lib/drizzle';
import { user, role, userRole, worker, stock } from "@/drizzle/schema";

export class UserService {
    /**
     * Aggregates stats for the dashboard based on role
     */
    static async getDashboardStats(roleName: string, userId: number) {
        if (roleName === ROLE.ADMIN.value) {
            const [userStats] = await db.select({ count: count() }).from(user);
            const [stockStats] = await db.select({
                totalValuation: sql<number>`SUM(selling_price * quantity)`
            }).from(stock);

            // Get role distribution
            const roles = await db.select({
                name: role.name,
                count: count(userRole.userId)
            })
                .from(role)
                .leftJoin(userRole, eq(role.id, userRole.roleId))
                .groupBy(role.name);

            return {
                totalUsers: userStats.count,
                totalValuation: stockStats.totalValuation || 0,
                roleDistribution: roles,
                systemStatus: 'Online'
            };
        }

        if (roleName === ROLE.FARMER.value) {
            // Stats relative to this farmer (inventory/labour)
            // For now, simplicity: overall inventory stats
            const [stockStats] = await db.select({
                totalRevenue: sql<number>`SUM(selling_price * quantity)`,
                totalCost: sql<number>`SUM(cost * quantity)`,
                count: count()
            }).from(stock);

            const [workerStats] = await db.select({ count: count() }).from(worker);

            return {
                revenue: stockStats.totalRevenue || 0,
                cost: stockStats.totalCost || 0,
                profit: (stockStats.totalRevenue || 0) - (stockStats.totalCost || 0),
                inventoryCount: stockStats.count,
                labourCount: workerStats.count
            };
        }

        if (roleName === ROLE.WORKER.value) {
            // Stats relevant to a worker (assigned farm, tasks)
            const [workerRecord] = await db.select().from(worker).where(eq(worker.userId, userId)).limit(1);

            return {
                assignedFarm: workerRecord?.farm || 'Global',
                role: workerRecord?.role || 'Field Operator',
                joinDate: workerRecord?.createdAt,
                tasksCompleted: 12, // Mocked for now
                productivityIndex: 94 // Mocked for now
            };
        }

        return {};
    }
    /**
     * Find a user with role by email or username
     */
    static async findByIdentifier(identifier: string): Promise<Record<string, unknown> | null> {
        const result = await db.select({
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            password: user.password,
            role: role.name
        })
            .from(user)
            .leftJoin(userRole, eq(user.id, userRole.userId))
            .leftJoin(role, eq(userRole.roleId, role.id))
            .where(or(eq(user.email, identifier), eq(user.username, identifier)))
            .limit(1);

        return (result[0] as Record<string, unknown>) || null;
    }

    /**
     * Authentication Logic: Login
     */
    static async login(identifier: string, password: string) {
        const foundUser = await this.findByIdentifier(identifier);

        if (!foundUser) {
            throw new AuthException(ApiErrorCode.INVALID_CREDENTIALS);
        }

        const isPasswordValid = await comparePassword(password, foundUser.password as string);

        if (!isPasswordValid) {
            throw new AuthException(ApiErrorCode.INVALID_CREDENTIALS);
        }

        const token = generateToken({
            id: foundUser.id as number,
            email: foundUser.email as string,
            role: foundUser.role as string,
        });

        return {
            user: {
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name,
                username: foundUser.username,
                role: foundUser.role
            },
            token
        };
    }

    /**
     * Authentication Logic: Registration
     */
    static async register(userData: { email?: string, password: string, name: string, username?: string, roleName?: string, parentUserId?: number }) {
        const identifier = userData.email || userData.username;
        if (!identifier) {
            throw new ValidationException(ApiErrorCode.MISSING_FIELDS);
        }

        const existingUser = await this.findByIdentifier(identifier);
        if (existingUser) {
            throw new ValidationException(userData.email ? ApiErrorCode.EMAIL_IN_USE : ApiErrorCode.USERNAME_IN_USE);
        }

        const hashedPassword = await hashPassword(userData.password);
        const finalUsername = userData.username || (userData.email ? userData.email.split('@')[0] : 'user') + Math.floor(Math.random() * 1000);

        return await db.transaction(async (tx) => {
            const [newUser] = await tx.insert(user).values({
                email: userData.email,
                password: hashedPassword,
                name: userData.name,
                username: finalUsername,
                parentUserId: userData.parentUserId,
                status: STATUS.ACTIVE.code
            }).returning();

            const targetRoleName = (userData.roleName || ROLE.FARMER.value).toUpperCase();
            const [roleRecord] = await tx.select().from(role).where(eq(role.name, targetRoleName)).limit(1);

            if (roleRecord) {
                await tx.insert(userRole).values({
                    userId: newUser.id,
                    roleId: roleRecord.id,
                    status: STATUS.ACTIVE.code
                });
            }

            const token = generateToken({
                id: newUser.id,
                email: newUser.email || undefined,
                role: targetRoleName,
            });

            return {
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    username: newUser.username,
                    role: targetRoleName
                },
                token
            };
        });
    }

    /**
     * Get sanitized User Profile with Role
     */
    static async getProfile(id: number) {
        const result = await db.select({
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            role: role.name
        })
            .from(user)
            .leftJoin(userRole, eq(user.id, userRole.userId))
            .leftJoin(role, eq(userRole.roleId, role.id))
            .where(eq(user.id, id))
            .limit(1);

        if (!result[0]) {
            throw new NotFoundException(ApiErrorCode.NOT_FOUND_ERROR);
        }

        return result[0];
    }

    /**
     * Update user details
     */
    static async update(id: number, userData: Partial<NewUser>): Promise<User | null> {
        const [updatedUser] = await db.update(user)
            .set({
                ...userData,
                updatedAt: Math.floor(Date.now() / 1000)
            })
            .where(eq(user.id, id))
            .returning();
        return (updatedUser as User) || null;
    }
}
