import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json();
    const updatedUser = await prisma.user.update({
      where: { id: context.params.id },
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
      ...updatedUser,
      dateOfBirth: updatedUser.dateOfBirth?.toISOString(),
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