import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Supprimer d'abord toutes les disponibilités
    await prisma.availability.deleteMany();
    
    // Puis supprimer tous les utilisateurs de type STUDENT
    await prisma.user.deleteMany({
      where: {
        role: 'STUDENT',
      },
    });

    return NextResponse.json({ message: 'Données de test supprimées avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression des données de test:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression des données de test' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 