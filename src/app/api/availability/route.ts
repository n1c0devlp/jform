import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { studentInfo, availabilities } = await request.json();

    // Créer ou mettre à jour l'utilisateur
    const user = await prisma.user.upsert({
      where: { email: studentInfo.email },
      update: {
        firstName: studentInfo.firstName,
        lastName: studentInfo.lastName,
        instrument: studentInfo.instrument,
        secondaryInstrument: studentInfo.secondaryInstrument,
        level: studentInfo.level,
        teacher: studentInfo.teacher,
        phone: studentInfo.phone,
      },
      create: {
        email: studentInfo.email,
        firstName: studentInfo.firstName,
        lastName: studentInfo.lastName,
        instrument: studentInfo.instrument,
        secondaryInstrument: studentInfo.secondaryInstrument,
        level: studentInfo.level,
        teacher: studentInfo.teacher,
        phone: studentInfo.phone,
        role: 'STUDENT',
      },
    });

    // Supprimer les anciennes disponibilités
    await prisma.availability.deleteMany({
      where: { userId: user.id },
    });

    // Créer les nouvelles disponibilités
    const createdAvailabilities = await prisma.availability.createMany({
      data: availabilities.map((slot: any) => ({
        userId: user.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    });

    return NextResponse.json({
      message: 'Informations enregistrées avec succès',
      user,
      availabilitiesCount: createdAvailabilities.count,
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement des informations' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 