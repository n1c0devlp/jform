import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Vérifier si l'utilisateur est connecté et a les droits nécessaires
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role as string)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const studentId = params.id;

    // Mettre à jour l'élève
    const updatedStudent = await prisma.user.update({
      where: { id: studentId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth),
        instrument: data.instrument,
        secondaryInstrument: data.secondaryInstrument,
        level: data.level,
        teacher: data.teacher,
        email: data.email,
        phone: data.phone,
      },
    });

    return NextResponse.json({
      ...updatedStudent,
      dateOfBirth: updatedStudent.dateOfBirth?.toISOString(),
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'élève:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'élève' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 