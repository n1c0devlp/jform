const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');
require('dotenv/config');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash('admin123', 12);

  // Create super admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@jform.fr' },
    update: {
      firstName: 'Admin',
      lastName: 'Super',
      role: 'SUPER_ADMIN',
      password: hashedPassword,
      isActive: true,
    },
    create: {
      email: 'admin@jform.fr',
      firstName: 'Admin',
      lastName: 'Super',
      role: 'SUPER_ADMIN',
      password: hashedPassword,
      isActive: true,
    },
  });

  console.log({ superAdmin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 