import { ValidationException, NotFoundException } from '@/lib/server';
import { ROLE, STATUS } from '@/lib';
import { ApiErrorCode, Pagination } from '@/types';
import { eq, desc } from "drizzle-orm";
import db from '@/lib/drizzle';
import { user, worker } from "@/drizzle/schema";
import { UserService } from "./user.service";

export class WorkerService {
  /**
   * Create a new Worker and their corresponding User account
   */
  static async create(data: {
    name: string,
    email: string,
    username?: string,
    farm?: string,
    role?: string
  }) {
    const { name, email, username, farm, role } = data;

    if (!name || !email) {
      throw new ValidationException(ApiErrorCode.MISSING_FIELDS);
    }

    // 1. Create the User account with WORKER role
    // Default password as requested: Welcome@123
    const { user: newUser } = await UserService.register({
      email,
      name,
      username,
      password: 'Welcome@123',
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
  static async listPaginated(pagination: Pagination) {
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
      .where(eq(worker.status, STATUS.ACTIVE.code))
      .$dynamic();

    // Default sorting by createdAt desc
    const results = await query.orderBy(desc(worker.createdAt))
      .limit(pagination.size)
      .offset((pagination.page - 1) * pagination.size);

    return results;
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


