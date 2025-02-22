import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SuggestionParams {
  instrument?: string;
  level?: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
}

export async function POST(request: Request) {
  try {
    const params: SuggestionParams = await request.json();
    
    // Récupérer les disponibilités des étudiants avec les filtres
    const availabilities = await prisma.availability.findMany({
      where: {
        dayOfWeek: params.dayOfWeek,
        startTime: params.startTime,
        endTime: params.endTime,
        user: {
          instrument: params.instrument,
          level: params.level,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            instrument: true,
            level: true,
          },
        },
      },
    });

    // Grouper les étudiants par créneau horaire
    const groupedByTime: { [key: string]: typeof availabilities } = {};
    availabilities.forEach((availability) => {
      const timeKey = `${availability.dayOfWeek}-${availability.startTime}-${availability.endTime}`;
      if (!groupedByTime[timeKey]) {
        groupedByTime[timeKey] = [];
      }
      groupedByTime[timeKey].push(availability);
    });

    // Générer les suggestions de groupes
    const suggestions = Object.entries(groupedByTime)
      .filter(([_, students]) => students.length >= 2) // Au moins 2 étudiants par groupe
      .map(([timeKey, students]) => {
        const [dayOfWeek, startTime, endTime] = timeKey.split('-');
        return {
          dayOfWeek: parseInt(dayOfWeek),
          startTime,
          endTime,
          students: students.map((a) => a.user),
          suggestedName: `Groupe ${students[0].user.instrument} ${students[0].user.level} - ${startTime}`,
        };
      });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Erreur lors de la génération des suggestions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération des suggestions' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 