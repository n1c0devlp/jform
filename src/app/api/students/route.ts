import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface StudentData {
  id: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: Date | null;
  instrument: string | null;
  secondaryInstrument: string | null;
  level: string | null;
  teacher: string | null;
  email: string;
  phone: string | null;
}

export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        instrument: true,
        secondaryInstrument: true,
        level: true,
        teacher: true,
        email: true,
        phone: true,
      },
      orderBy: {
        lastName: 'asc',
      },
    });

    // Formater les dates pour le client
    const formattedStudents = students.map((student: StudentData) => ({
      ...student,
      dateOfBirth: student.dateOfBirth?.toISOString() || null,
    }));

    return NextResponse.json(formattedStudents);
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des élèves' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 