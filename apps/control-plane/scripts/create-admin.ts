import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const args = process.argv.slice(2);
  const emailIndex = args.indexOf('--email');
  const passwordIndex = args.indexOf('--password');

  if (emailIndex === -1 || passwordIndex === -1) {
    console.error('Usage: npm run create-admin -- --email <email> --password <password>');
    process.exit(1);
  }

  const email = args[emailIndex + 1];
  const password = args[passwordIndex + 1];

  if (!email || !password) {
    console.error('Email and password are required');
    process.exit(1);
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error('User with this email already exists');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'OWNER',
        isActive: true,
        isVerified: true,
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`ID: ${user.id}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
