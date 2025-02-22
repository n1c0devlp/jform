import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      orderBy: {
        dayOfWeek: 'asc',
      },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des groupes' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const group = await prisma.group.create({
      data: {
        name: data.name,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        level: data.level,
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error('Erreur lors de la création du groupe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du groupe' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 