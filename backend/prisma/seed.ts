import { PrismaClient, Role, CustomerType, CustomerStatus, MovementType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Clean existing records (Optional for clean idempotency)
  await prisma.challanItem.deleteMany({});
  await prisma.salesChallan.deleteMany({});
  await prisma.stockMovement.deleteMany({});
  await prisma.customerNote.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Default Role Users
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const salesPassword = await bcrypt.hash('Sales123!', 10);
  const warehousePassword = await bcrypt.hash('Warehouse123!', 10);
  const accountsPassword = await bcrypt.hash('Accounts123!', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@minierp.com',
      passwordHash: adminPassword,
      fullName: 'System Administrator',
      role: Role.ADMIN,
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      email: 'sales@minierp.com',
      passwordHash: salesPassword,
      fullName: 'John Sales Executive',
      role: Role.SALES,
    },
  });

  const warehouseUser = await prisma.user.create({
    data: {
      email: 'warehouse@minierp.com',
      passwordHash: warehousePassword,
      fullName: 'Alex Warehouse Manager',
      role: Role.WAREHOUSE,
    },
  });

  const accountsUser = await prisma.user.create({
    data: {
      email: 'accounts@minierp.com',
      passwordHash: accountsPassword,
      fullName: 'Sarah Accounts Officer',
      role: Role.ACCOUNTS,
    },
  });

  console.log('✅ Users seeded successfully:');
  console.log('   - admin@minierp.com (Admin)');
  console.log('   - sales@minierp.com (Sales)');
  console.log('   - warehouse@minierp.com (Warehouse)');
  console.log('   - accounts@minierp.com (Accounts)');

  // 3. Create Sample Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Rajesh Kumar',
      mobile: '+91 9876543210',
      email: 'rajesh@apexdistributors.com',
      businessName: 'Apex Wholesale & Distributors',
      gstNumber: '27AAAAA0000A1Z5',
      customerType: CustomerType.WHOLESALE,
      address: 'Plot 45, MIDC Industrial Area, Mumbai, India',
      status: CustomerStatus.ACTIVE,
      followUpDate: new Date('2026-08-20'),
      notes: {
        create: [
          {
            note: 'Initial onboard meeting completed. Agreed on 15-day credit terms.',
            createdBy: salesUser.id,
          },
        ],
      },
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Ananya Sharma',
      mobile: '+91 9123456789',
      email: 'ananya@technotrail.com',
      businessName: 'TechnoTrail Retail Store',
      gstNumber: '07BBBBB1111B1Z2',
      customerType: CustomerType.RETAIL,
      address: 'Shop 12, Commercial Complex, Delhi, India',
      status: CustomerStatus.LEAD,
      followUpDate: new Date('2026-08-15'),
      notes: {
        create: [
          {
            note: 'Interested in bulk purchase of Industrial Sensors. Requested quote.',
            createdBy: salesUser.id,
          },
        ],
      },
    },
  });

  console.log('✅ Sample customers seeded.');

  // 4. Create Sample Products
  const prod1 = await prisma.product.create({
    data: {
      name: 'Industrial Microcontroller Unit (MCU-V2)',
      sku: 'PROD-MCU-001',
      category: 'Electronics',
      unitPrice: 1250.00,
      currentStock: 150,
      minStockAlert: 20,
      location: 'Rack-A1',
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      name: 'Digital Pressure Sensor 10-Bar',
      sku: 'PROD-SEN-002',
      category: 'Sensors',
      unitPrice: 4500.50,
      currentStock: 12, // Low stock! minStockAlert is 15
      minStockAlert: 15,
      location: 'Rack-B3',
    },
  });

  const prod3 = await prisma.product.create({
    data: {
      name: 'Heavy Duty Relay Switch 24V',
      sku: 'PROD-SWI-003',
      category: 'Electrical',
      unitPrice: 320.00,
      currentStock: 500,
      minStockAlert: 50,
      location: 'Rack-C2',
    },
  });

  console.log('✅ Sample product catalog seeded.');

  // 5. Create Initial Stock Movements
  await prisma.stockMovement.createMany({
    data: [
      {
        productId: prod1.id,
        quantity: 150,
        movementType: MovementType.IN,
        reason: 'Initial Batch Stock Procurement',
        createdBy: warehouseUser.id,
      },
      {
        productId: prod2.id,
        quantity: 12,
        movementType: MovementType.IN,
        reason: 'Initial Stock Audit Inflow',
        createdBy: warehouseUser.id,
      },
      {
        productId: prod3.id,
        quantity: 500,
        movementType: MovementType.IN,
        reason: 'Vendor Batch Delivery',
        createdBy: warehouseUser.id,
      },
    ],
  });

  console.log('✅ Initial stock audit log seeded.');
  console.log('🚀 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
