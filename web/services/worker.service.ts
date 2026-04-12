import { ValidationException, NotFoundException } from '@/lib/server';
import { ROLE, STATUS } from '@/lib';
import { ApiErrorCode } from '@/types';
import { eq, desc, sql, asc } from "drizzle-orm";
import db from '@/lib/drizzle';
import { user, worker } from "@/drizzle/schema";
import { UserService } from "./user.service";

export class WorkerService {
  /**
   * Create a new Worker and their corresponding User account
   */
  static async create(data: {
    name: string,
    email?: string,
    username?: string,
    password?: string,
    farm?: string,
    role?: string,
    recruiterId?: number
  }) {
    const { name, email, username, password, farm, role, recruiterId } = data;

    if (!name || !username) {
      throw new ValidationException(ApiErrorCode.MISSING_FIELDS);
    }

    // 1. Create the User account with WORKER role
    // Default password as requested: Welcome@123
    const { user: newUser } = await UserService.register({
      email: email || '',
      name,
      username,
      password: password || 'Welcome@123',
      parentUserId: recruiterId,
      roleName: ROLE.WORKER.value
    });

    // 2. Create the Worker record linked to the User
    const [newWorker] = await db.insert(worker).values({
      userId: newUser.id,
      farm: farm || '',
      role: role || '',
      status: STATUS.ACTIVE.code
    }).returning();

    return {
      ...newWorker,
      user: newUser
    };
  }

  /**
   * List paginated workers with user details (using join)
   */
  static async listPaginated(pagination: { pageNumber: number, size: number, sortBy?: string, sortOrder?: 'asc' | 'desc' }) {
    const query = db.select({
      id: worker.id,
      farm: worker.farm,
      role: worker.role,
      status: worker.status,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username
      }
    })
      .from(worker)
      .innerJoin(user, eq(worker.userId, user.id))
      .where(eq(worker.status, STATUS.ACTIVE.code));

    // Get total count for pagination
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(worker)
      .where(eq(worker.status, STATUS.ACTIVE.code));

    const total = Number(countResult.count);
    const totalPages = Math.ceil(total / pagination.size);

    // Dynamic sorting
    const sortField = pagination.sortBy === 'name' ? user.name : (pagination.sortBy === 'farm' ? worker.farm : worker.createdAt);

    const results = await (query as any).orderBy(pagination.sortOrder === 'asc' ? sortField : desc(sortField))
      .limit(pagination.size)
      .offset((pagination.pageNumber - 1) * pagination.size)
      .$dynamic();

    return {
      data: results,
      pagination: {
        page: pagination.pageNumber,
        size: pagination.size,
        total,
        totalPages
      }
    };
  }

  /**
   * Soft delete worker and their user account
   */
  static async delete(id: number) {
    return await db.transaction(async (tx) => {
      const [workerRecord] = await tx.update(worker)
        .set({ status: STATUS.INACTIVE.code })
        .where(eq(worker.id, id))
        .returning();

      if (!workerRecord) throw new NotFoundException(ApiErrorCode.NOT_FOUND_ERROR);

      // Also inactive the user account
      await tx.update(user)
        .set({ status: STATUS.INACTIVE.code })
        .where(eq(user.id, workerRecord.userId));

      return workerRecord;
    });
  }
}
