import { ValidationException, NotFoundException } from '@/lib/server';
import { STATUS } from '@/lib';
import { NewStock, Stock, ApiErrorCode } from '@/types';
import { eq, asc, desc, sql } from "drizzle-orm";
import db from '@/lib/drizzle';
import { stock } from "@/drizzle/schema";

export class StockService {
  /**
   * Get all stock items for a user
   */
  static async findByUserId(userId: number): Promise<Stock[]> {
    return await db.select().from(stock).where(eq(stock.userId, userId));
  }

  /**
   * Get paginated and sorted stock items for a user
   */
  static async listPaginated(userId: number, pagination: { pageNumber: number, size: number, sortBy?: string, sortOrder?: 'asc' | 'desc' }) {
    let query = db.select().from(stock).where(eq(stock.userId, userId));

    // Get total count
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(stock)
      .where(eq(stock.userId, userId));

    const total = Number(countResult.count);
    const totalPages = Math.ceil(total / pagination.size);

    // Handle dynamic sorting
    if (pagination.sortBy && (stock as any)[pagination.sortBy]) {
      const orderFn = pagination.sortOrder === 'asc' ? asc : desc;
      query = (query as any).orderBy(orderFn((stock as any)[pagination.sortBy]));
    } else {
      query = (query as any).orderBy(desc(stock.createdAt));
    }

    const results = await (query as any)
      .limit(pagination.size)
      .offset((pagination.pageNumber - 1) * pagination.size)
      .$dynamic();

    return {
      items: results,
      pagination: {
        page: pagination.pageNumber,
        size: pagination.size,
        total,
        totalPages
      }
    };
  }

  /**
   * Create a new stock item
   * Handles numeric conversion and basic validation
   */
  static async create(data: {
    name: string,
    quantity: string | number,
    location: string,
    cost: string | number,
    sellingPrice: string | number,
    userId: number
  }): Promise<Stock> {
    const { name, quantity, location, cost, sellingPrice, userId } = data;

    if (!name || !quantity || !location || !cost || !sellingPrice) {
      throw new ValidationException(ApiErrorCode.MISSING_FIELDS);
    }

    const [newStock] = await db.insert(stock).values({
      name,
      quantity: typeof quantity === 'string' ? parseInt(quantity) : quantity,
      location,
      cost: cost.toString(),
      sellingPrice: sellingPrice.toString(),
      userId: userId,
      status: STATUS.ACTIVE.code
    }).returning();

    return newStock as Stock;
  }

  /**
   * Update an existing stock item
   */
  static async update(id: number, data: Partial<NewStock>): Promise<Stock> {
    const [updatedStock] = await db.update(stock)
      .set({
        ...data,
        updatedAt: Math.floor(Date.now() / 1000)
      })
      .where(eq(stock.id, id))
      .returning();

    if (!updatedStock) {
      throw new NotFoundException(ApiErrorCode.NOT_FOUND_ERROR);
    }

    return updatedStock as Stock;
  }

  /**
   * Soft Delete a stock item (Set status to 0)
   */
  static async delete(id: number): Promise<Stock> {
    const [updatedStock] = await db.update(stock)
      .set({
        status: STATUS.INACTIVE.code,
        updatedAt: Math.floor(Date.now() / 1000)
      })
      .where(eq(stock.id, id))
      .returning();

    if (!updatedStock) {
      throw new NotFoundException(ApiErrorCode.NOT_FOUND_ERROR);
    }

    return updatedStock as Stock;
  }
}
