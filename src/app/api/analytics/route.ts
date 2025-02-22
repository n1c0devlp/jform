import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

interface Distribution {
  [key: string]: number;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Récupérer le nombre total d'utilisateurs et leur distribution par rôle
    const users = await prisma.user.findMany({
      select: {
        id: true,
        role: true,
        isActive: true,
        instrument: true,
        level: true,
      },
    });

    const usersByRole = users.reduce((acc: Distribution, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {
      STUDENT: 0,
      TEACHER: 0,
      ADMIN: 0,
      SUPER_ADMIN: 0,
    });

    const activeUsers = users.filter(user => user.isActive).length;

    // Distribution des instruments
    const instrumentDistribution = users.reduce((acc: Distribution, user) => {
      if (user.instrument) {
        acc[user.instrument] = (acc[user.instrument] || 0) + 1;
      }
      return acc;
    }, {});

    // Distribution des niveaux
    const levelDistribution = users.reduce((acc: Distribution, user) => {
      if (user.level) {
        acc[user.level] = (acc[user.level] || 0) + 1;
      }
      return acc;
    }, {});

    // Nombre total de groupes
    const totalGroups = await prisma.group.count();

    // Nombre total de disponibilités
    const totalAvailabilities = await prisma.availability.count();

    // Connexions récentes (simulées car nous n'avons pas de table de logs)
    // Dans une vraie application, vous devriez avoir une table de logs de connexion
    const recentConnections = await prisma.user.findMany({
      where: {
        NOT: {
          role: 'STUDENT',
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 10,
    });

    return NextResponse.json({
      totalUsers: users.length,
      usersByRole,
      activeUsers,
      totalGroups,
      totalAvailabilities,
      instrumentDistribution,
      levelDistribution,
      recentConnections: recentConnections.map(conn => ({
        id: conn.id,
        email: conn.email,
        role: conn.role,
        lastConnection: conn.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des analytics:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des analytics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 