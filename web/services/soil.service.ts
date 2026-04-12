import { ValidationException, NotFoundException } from '@/lib/server';
import { STATUS, EXTERNAL_API } from '@/lib';
import { SoilData, ApiErrorCode } from '@/types';
import { eq, desc } from "drizzle-orm";
import db from '@/lib/drizzle';
import { soilData } from "@/drizzle/schema";

export class SoilService {
    /**
     * Get the latest soil record for a user
     */
    static async findLatestByUserId(userId: number): Promise<SoilData | null> {
        const result = await db.select().from(soilData)
            .where(eq(soilData.userId, userId))
            .orderBy(desc(soilData.createdAt))
            .limit(1);
        return result[0] || null;
    }

    /**
     * Internal helper to call Python ML API
     */
    private static async getMLPrediction(data: unknown): Promise<{ fertility_class: string, confidence: number }> {
        const pythonApiUrl = EXTERNAL_API.SOIL_ML;

        try {
            const response = await fetch(`${pythonApiUrl}/api/soil/predict/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'External ML Service Error');
            }

            const prediction = await response.json();
            return prediction.data || prediction;
        } catch (error: unknown) {
            console.error("ML Prediction Error:", error);
            throw new Error((error as Error).message || "Failed to contact ML service");
        }
    }

    /**
     * Predict and Save Soil Data
     */
    static async predictAndSave(userId: number, input: Record<string, number>): Promise<unknown> {
        const { N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B } = input;

        const values = [N, P, K, pH, EC, OC, S, Zn, Fe, Cu, Mn, B];
        if (values.some(val => val === undefined || isNaN(val))) {
            throw new ValidationException(ApiErrorCode.VALIDATION_ERROR);
        }

        // 1. Get Prediction from Python API
        const { fertility_class, confidence } = await this.getMLPrediction(input);

        // 2. Save to Database
        const [record] = await db.insert(soilData).values({
            userId: userId,
            n: N, p: P, k: K, ph: pH, ec: EC, oc: OC, s: S, zn: Zn, fe: Fe, cu: Cu, mn: Mn, b: B,
            fertilityClass: fertility_class,
            confidence: confidence,
            status: STATUS.ACTIVE.code
        }).returning();

        return {
            ...record,
            fertility_class,
            confidence
        };
    }

    /**
     * Update existing record with new prediction
     */
    static async updateAndPredict(userId: number, input: Record<string, number>): Promise<unknown> {
        const existing = await this.findLatestByUserId(userId);
        if (!existing) {
            throw new NotFoundException(ApiErrorCode.NOT_FOUND_ERROR);
        }

        // 1. Get Prediction from Python API
        const { fertility_class, confidence } = await this.getMLPrediction(input);

        // 2. Update Database
        const [record] = await db.update(soilData)
            .set({
                n: input.N, p: input.P, k: input.K, ph: input.pH, ec: input.EC, oc: input.OC,
                s: input.S, zn: input.Zn, fe: input.Fe, cu: input.Cu, mn: input.Mn, b: input.B,
                fertilityClass: fertility_class,
                confidence: confidence,
                updatedAt: Math.floor(Date.now() / 1000)
            })
            .where(eq(soilData.id, existing.id))
            .returning();

        return {
            ...record,
            fertility_class,
            confidence
        };
    }
}
