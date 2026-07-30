import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Customs Broker database...');

  // Clean existing records
  await prisma.auditLog.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Password@123', 10);
  const adminPassword = await bcrypt.hash('Admin@123456', 10);

  // Create Admin User
  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@customsbroker.com',
      password: adminPassword,
      role: 'ADMIN',
      companyName: 'Customs National Authority',
      phone: '+91 9876543210',
    },
  });

  // Create Demo Broker User
  const broker = await prisma.user.create({
    data: {
      name: 'Rajesh Sharma',
      email: 'broker@customsbroker.com',
      password: hashedPassword,
      role: 'BROKER',
      brokerLicenseNo: 'CB-MUM-2024-8849',
      companyName: 'Apex Customs Clearing & Freight Pvt Ltd',
      phone: '+91 9819001122',
    },
  });

  console.log(`✅ Created Broker: ${broker.email} (License: ${broker.brokerLicenseNo})`);
  console.log(`✅ Created Admin: ${admin.email}`);

  // Create Dummy Onboarded Exporter & Importer Customers
  const dummyCustomers = [
    {
      brokerId: broker.id,
      name: 'Hindustan Spices & Agro Exports Ltd',
      tradeName: 'Hindustan Spices',
      email: 'exports@hindustanspices.com',
      phone: '+91 9920112233',
      customerType: 'EXPORTER',
      gstin: '27AAACH1234F1Z5',
      iec: '0304918234',
      pan: 'AAACH1234F',
      address: 'Plot 42, APMC Market Yard, Vashi',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      pincode: '400703',
      status: 'VERIFIED',
    },
    {
      brokerId: broker.id,
      name: 'Global Tech Components India Pvt Ltd',
      tradeName: 'G-Tech Imports',
      email: 'logistics@gtechindia.co.in',
      phone: '+91 9820445566',
      customerType: 'IMPORTER',
      gstin: '27AABCG5678D1Z2',
      iec: '0512398472',
      pan: 'AABCG5678D',
      address: 'Building B, SEZ Tech Park, Hinjewadi',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411057',
      status: 'VERIFIED',
    },
    {
      brokerId: broker.id,
      name: 'Zenith Organic Garments LLP',
      tradeName: 'Zenith Apparel',
      email: 'customs@zenithgarments.com',
      phone: '+91 9711223344',
      customerType: 'BOTH',
      gstin: '07AAAFZ9876E1Z8',
      iec: '0798123456',
      pan: 'AAAFZ9876E',
      address: 'Industrial Area Phase 2, Okhla',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110020',
      status: 'VERIFIED',
    },
    {
      brokerId: broker.id,
      name: 'Southern Marine Seafood Traders',
      tradeName: 'Southern Marine',
      email: 'info@marineseafoods.org',
      phone: '+91 9447012345',
      customerType: 'EXPORTER',
      gstin: '32AAACS4321K1Z3',
      iec: '1088776655',
      pan: 'AAACS4321K',
      address: 'Willingdon Island Port Complex',
      city: 'Cochin',
      state: 'Kerala',
      pincode: '682003',
      status: 'VERIFIED',
    },
  ];

  for (const cust of dummyCustomers) {
    const created = await prisma.customer.create({ data: cust });
    console.log(`  📦 Customer: ${created.name} (${created.customerType} - GSTIN: ${created.gstin})`);
  }

  // Create Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: broker.id,
      action: 'SYSTEM_INITIALIZED',
      details: 'Initial database seed with default broker & customer profiles',
    },
  });

  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
