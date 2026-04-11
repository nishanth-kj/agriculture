import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import db from '../../lib/drizzle';
import * as dbSchema from '../schema';

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed Roles
  console.log('👥 Seeding roles...');
  const rolesToSeed = [
    { id: 1, name: 'ADMIN', status: 1 },
    { id: 2, name: 'FARMER', status: 1 },
    { id: 3, name: 'WORKER', status: 1 },
  ];

  for (const r of rolesToSeed) {
    await db.insert(dbSchema.role).values(r).onConflictDoNothing();
  }
  
  const allRoles = await db.select().from(dbSchema.role);
  const adminRole = allRoles.find(r => r.name === 'ADMIN')!;

  // 2. Seed Admin User
  console.log('👤 Seeding admin user...');
  const hashedPassword = await bcrypt.hash('AdminAdmin', 10);
  const EMAIL_ADDRESS = "nishanthkj@gmail.com";

  const [adminUser] = await db.insert(dbSchema.user).values({
    username: 'nishanth-kj',
    name: 'Nishanth K J',
    email: EMAIL_ADDRESS,
    password: hashedPassword,
    status: 1,
  }).onConflictDoUpdate({
    target: dbSchema.user.username,
    set: {
      email: EMAIL_ADDRESS,
      name: 'Nishanth K J',
      password: hashedPassword,
    }
  }).returning();

  // 3. Assign Admin Role
  await db.insert(dbSchema.userRole).values({
    userId: adminUser.id,
    roleId: adminRole.id,
    status: 1
  }).onConflictDoNothing();

  console.log('✅ User seeded & role assigned:', adminUser.email);

  // 4. Seed Stocks
  await db.delete(dbSchema.stock).where(eq(dbSchema.stock.userId, adminUser.id));
  
  await db.insert(dbSchema.stock).values([
    { name: 'Body', quantity: 233, location: 'New Donald', cost: '19.5', sellingPrice: '29.5', userId: adminUser.id, status: 1 },
    { name: 'Rock', quantity: 249, location: 'North Michellechester', cost: '25.3', sellingPrice: '35.3', userId: adminUser.id, status: 1 },
    { name: 'Well', quantity: 300, location: 'Port Brittanymouth', cost: '10.75', sellingPrice: '20.5', userId: adminUser.id, status: 1 },
  ]);

  console.log('✅ Stocks seeded!');

  // 5. Seed Soil Data
  await db.delete(dbSchema.soilData).where(eq(dbSchema.soilData.userId, adminUser.id));

  await db.insert(dbSchema.soilData).values([
    {
      userId: adminUser.id,
      n: 1.1,
      p: 2.2,
      k: 3.3,
      ph: 6.5,
      ec: 0.5,
      oc: 0.7,
      s: 10,
      zn: 0.8,
      fe: 1.5,
      cu: 0.9,
      mn: 0.6,
      b: 0.4,
      fertilityClass: 'High',
      confidence: 0.94,
      status: 1,
    },
  ]);

  console.log('✅ Soil data seeded!');
  console.log('✨ Seeding complete!');
  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
