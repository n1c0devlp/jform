import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AvailabilityWithUser {
  id: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    firstName: string;
    lastName: string;
    instrument: string;
    level: string;
  };
}

export async function GET() {
  try {
    const availabilities = await prisma.availability.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            instrument: true,
            level: true,
          },
        },
      },
      orderBy: {
        dayOfWeek: 'asc',
      },
    });

    // Transformer les données pour inclure les informations de l'utilisateur directement
    const formattedAvailabilities = availabilities.map((availability: AvailabilityWithUser) => ({
      id: availability.id,
      firstName: availability.user.firstName,
      lastName: availability.user.lastName,
      instrument: availability.user.instrument,
      level: availability.user.level,
      dayOfWeek: availability.dayOfWeek,
      startTime: availability.startTime,
      endTime: availability.endTime,
    }));

    return NextResponse.json(formattedAvailabilities);
  } catch (error) {
    console.error('Erreur lors de la récupération des disponibilités:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des disponibilités' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 