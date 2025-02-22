import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testStudents = [
  {
    firstName: 'Marie',
    lastName: 'Dubois',
    dateOfBirth: new Date('2008-03-15'),
    instrument: 'Violon',
    secondaryInstrument: 'Alto',
    level: '3CD1',
    teacher: 'J. MEUNIER',
    phone: '06 12 34 56 78',
    email: 'marie.dubois@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 1, startTime: '14:00', endTime: '15:00' },
        { dayOfWeek: 3, startTime: '16:00', endTime: '17:00' },
      ],
    },
  },
  {
    firstName: 'Lucas',
    lastName: 'Martin',
    dateOfBirth: new Date('2007-06-22'),
    instrument: 'Alto',
    secondaryInstrument: null,
    level: '3CD2',
    teacher: 'F. VOGHT',
    phone: '06 23 45 67 89',
    email: 'lucas.martin@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 2, startTime: '15:00', endTime: '16:00' },
        { dayOfWeek: 4, startTime: '17:00', endTime: '18:00' },
      ],
    },
  },
  {
    firstName: 'Emma',
    lastName: 'Bernard',
    dateOfBirth: new Date('2009-11-30'),
    instrument: 'Clarinette',
    secondaryInstrument: null,
    level: 'PPES1',
    teacher: 'J. MEUNIER',
    phone: '06 34 56 78 90',
    email: 'emma.bernard@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 1, startTime: '16:00', endTime: '17:00' },
        { dayOfWeek: 5, startTime: '14:00', endTime: '15:00' },
      ],
    },
  },
  {
    firstName: 'Thomas',
    lastName: 'Petit',
    dateOfBirth: new Date('2006-09-08'),
    instrument: 'Violon',
    secondaryInstrument: 'Clarinette',
    level: '3CR1',
    teacher: 'F. VOGHT',
    phone: '06 45 67 89 01',
    email: 'thomas.petit@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 2, startTime: '14:00', endTime: '15:00' },
        { dayOfWeek: 4, startTime: '15:00', endTime: '16:00' },
      ],
    },
  },
  {
    firstName: 'Léa',
    lastName: 'Roux',
    dateOfBirth: new Date('2008-01-25'),
    instrument: 'Alto',
    secondaryInstrument: null,
    level: 'PPES2',
    teacher: 'J. MEUNIER',
    phone: '06 56 78 90 12',
    email: 'lea.roux@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 3, startTime: '14:00', endTime: '15:00' },
        { dayOfWeek: 5, startTime: '16:00', endTime: '17:00' },
      ],
    },
  },
  // Nouveaux élèves
  {
    firstName: 'Antoine',
    lastName: 'Moreau',
    dateOfBirth: new Date('2007-04-12'),
    instrument: 'Violon',
    secondaryInstrument: 'Piano',
    level: '3CD3',
    teacher: 'F. VOGHT',
    phone: '06 78 90 12 34',
    email: 'antoine.moreau@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 1, startTime: '15:00', endTime: '16:00' },
        { dayOfWeek: 4, startTime: '14:00', endTime: '15:00' },
      ],
    },
  },
  {
    firstName: 'Sarah',
    lastName: 'Lambert',
    dateOfBirth: new Date('2009-07-18'),
    instrument: 'Clarinette',
    secondaryInstrument: null,
    level: '3CD2',
    teacher: 'J. MEUNIER',
    phone: '06 89 01 23 45',
    email: 'sarah.lambert@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 2, startTime: '16:00', endTime: '17:00' },
        { dayOfWeek: 5, startTime: '15:00', endTime: '16:00' },
      ],
    },
  },
  {
    firstName: 'Hugo',
    lastName: 'Girard',
    dateOfBirth: new Date('2006-11-30'),
    instrument: 'Violoncelle',
    secondaryInstrument: null,
    level: 'PPES1',
    teacher: 'F. VOGHT',
    phone: '06 90 12 34 56',
    email: 'hugo.girard@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 3, startTime: '15:00', endTime: '16:00' },
        { dayOfWeek: 5, startTime: '14:00', endTime: '15:00' },
      ],
    },
  },
  {
    firstName: 'Camille',
    lastName: 'Leroy',
    dateOfBirth: new Date('2008-09-22'),
    instrument: 'Piano',
    secondaryInstrument: 'Violon',
    level: '3CR2',
    teacher: 'J. MEUNIER',
    phone: '06 01 23 45 67',
    email: 'camille.leroy@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 2, startTime: '14:00', endTime: '15:00' },
        { dayOfWeek: 4, startTime: '16:00', endTime: '17:00' },
      ],
    },
  },
  {
    firstName: 'Louis',
    lastName: 'Fournier',
    dateOfBirth: new Date('2007-03-15'),
    instrument: 'Hautbois',
    secondaryInstrument: null,
    level: '3CD4',
    teacher: 'F. VOGHT',
    phone: '06 12 34 56 78',
    email: 'louis.fournier@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 1, startTime: '16:00', endTime: '17:00' },
        { dayOfWeek: 3, startTime: '14:00', endTime: '15:00' },
      ],
    },
  },
  {
    firstName: 'Chloé',
    lastName: 'Dupuis',
    dateOfBirth: new Date('2009-01-08'),
    instrument: 'Violon',
    secondaryInstrument: 'Alto',
    level: '3CR1',
    teacher: 'J. MEUNIER',
    phone: '06 23 45 67 89',
    email: 'chloe.dupuis@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 2, startTime: '15:00', endTime: '16:00' },
        { dayOfWeek: 4, startTime: '15:00', endTime: '16:00' },
      ],
    },
  },
  {
    firstName: 'Gabriel',
    lastName: 'Mercier',
    dateOfBirth: new Date('2006-06-25'),
    instrument: 'Alto',
    secondaryInstrument: null,
    level: 'PPES3',
    teacher: 'F. VOGHT',
    phone: '06 34 56 78 90',
    email: 'gabriel.mercier@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 1, startTime: '14:00', endTime: '15:00' },
        { dayOfWeek: 3, startTime: '16:00', endTime: '17:00' },
      ],
    },
  },
  {
    firstName: 'Inès',
    lastName: 'Bonnet',
    dateOfBirth: new Date('2008-12-03'),
    instrument: 'Clarinette',
    secondaryInstrument: 'Piano',
    level: '3CD1',
    teacher: 'J. MEUNIER',
    phone: '06 45 67 89 01',
    email: 'ines.bonnet@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 2, startTime: '16:00', endTime: '17:00' },
        { dayOfWeek: 5, startTime: '14:00', endTime: '15:00' },
      ],
    },
  },
  {
    firstName: 'Nathan',
    lastName: 'Rousseau',
    dateOfBirth: new Date('2007-08-17'),
    instrument: 'Violoncelle',
    secondaryInstrument: null,
    level: '3CR3',
    teacher: 'F. VOGHT',
    phone: '06 56 78 90 12',
    email: 'nathan.rousseau@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 1, startTime: '15:00', endTime: '16:00' },
        { dayOfWeek: 4, startTime: '14:00', endTime: '15:00' },
      ],
    },
  },
  {
    firstName: 'Manon',
    lastName: 'Laurent',
    dateOfBirth: new Date('2009-05-29'),
    instrument: 'Piano',
    secondaryInstrument: null,
    level: '3CD2',
    teacher: 'J. MEUNIER',
    phone: '06 67 89 01 23',
    email: 'manon.laurent@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 2, startTime: '14:00', endTime: '15:00' },
        { dayOfWeek: 4, startTime: '16:00', endTime: '17:00' },
      ],
    },
  },
  {
    firstName: 'Arthur',
    lastName: 'Simon',
    dateOfBirth: new Date('2006-10-14'),
    instrument: 'Hautbois',
    secondaryInstrument: 'Clarinette',
    level: 'PPES2',
    teacher: 'F. VOGHT',
    phone: '06 78 90 12 34',
    email: 'arthur.simon@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 3, startTime: '15:00', endTime: '16:00' },
        { dayOfWeek: 5, startTime: '15:00', endTime: '16:00' },
      ],
    },
  },
  {
    firstName: 'Zoé',
    lastName: 'Michel',
    dateOfBirth: new Date('2008-02-11'),
    instrument: 'Violon',
    secondaryInstrument: null,
    level: '3CD3',
    teacher: 'J. MEUNIER',
    phone: '06 89 01 23 45',
    email: 'zoe.michel@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 1, startTime: '16:00', endTime: '17:00' },
        { dayOfWeek: 4, startTime: '15:00', endTime: '16:00' },
      ],
    },
  },
  {
    firstName: 'Maxime',
    lastName: 'Lefebvre',
    dateOfBirth: new Date('2007-12-20'),
    instrument: 'Alto',
    secondaryInstrument: 'Violon',
    level: '3CR2',
    teacher: 'F. VOGHT',
    phone: '06 90 12 34 56',
    email: 'maxime.lefebvre@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 2, startTime: '15:00', endTime: '16:00' },
        { dayOfWeek: 5, startTime: '16:00', endTime: '17:00' },
      ],
    },
  },
  {
    firstName: 'Alice',
    lastName: 'Morel',
    dateOfBirth: new Date('2009-03-07'),
    instrument: 'Clarinette',
    secondaryInstrument: null,
    level: 'PPES1',
    teacher: 'J. MEUNIER',
    phone: '06 01 23 45 67',
    email: 'alice.morel@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 1, startTime: '14:00', endTime: '15:00' },
        { dayOfWeek: 3, startTime: '15:00', endTime: '16:00' },
      ],
    },
  },
  {
    firstName: 'Paul',
    lastName: 'Bertrand',
    dateOfBirth: new Date('2006-07-31'),
    instrument: 'Violoncelle',
    secondaryInstrument: null,
    level: '3CD4',
    teacher: 'F. VOGHT',
    phone: '06 12 34 56 78',
    email: 'paul.bertrand@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 2, startTime: '16:00', endTime: '17:00' },
        { dayOfWeek: 4, startTime: '14:00', endTime: '15:00' },
      ],
    },
  },
  {
    firstName: 'Eva',
    lastName: 'Garnier',
    dateOfBirth: new Date('2008-11-09'),
    instrument: 'Piano',
    secondaryInstrument: null,
    level: '3CR1',
    teacher: 'J. MEUNIER',
    phone: '06 23 45 67 89',
    email: 'eva.garnier@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 1, startTime: '15:00', endTime: '16:00' },
        { dayOfWeek: 3, startTime: '16:00', endTime: '17:00' },
      ],
    },
  },
  {
    firstName: 'Jules',
    lastName: 'Faure',
    dateOfBirth: new Date('2007-01-26'),
    instrument: 'Hautbois',
    secondaryInstrument: null,
    level: 'PPES3',
    teacher: 'F. VOGHT',
    phone: '06 34 56 78 90',
    email: 'jules.faure@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 2, startTime: '14:00', endTime: '15:00' },
        { dayOfWeek: 5, startTime: '15:00', endTime: '16:00' },
      ],
    },
  },
  {
    firstName: 'Lucie',
    lastName: 'Andre',
    dateOfBirth: new Date('2009-06-13'),
    instrument: 'Violon',
    secondaryInstrument: 'Alto',
    level: '3CD1',
    teacher: 'J. MEUNIER',
    phone: '06 45 67 89 01',
    email: 'lucie.andre@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 1, startTime: '16:00', endTime: '17:00' },
        { dayOfWeek: 4, startTime: '15:00', endTime: '16:00' },
      ],
    },
  },
  {
    firstName: 'Théo',
    lastName: 'Lemaire',
    dateOfBirth: new Date('2006-09-28'),
    instrument: 'Alto',
    secondaryInstrument: null,
    level: '3CR3',
    teacher: 'F. VOGHT',
    phone: '06 56 78 90 12',
    email: 'theo.lemaire@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 2, startTime: '15:00', endTime: '16:00' },
        { dayOfWeek: 5, startTime: '14:00', endTime: '15:00' },
      ],
    },
  },
  {
    firstName: 'Nina',
    lastName: 'Legrand',
    dateOfBirth: new Date('2008-04-02'),
    instrument: 'Clarinette',
    secondaryInstrument: null,
    level: '3CD2',
    teacher: 'J. MEUNIER',
    phone: '06 67 89 01 23',
    email: 'nina.legrand@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 3, startTime: '14:00', endTime: '15:00' },
        { dayOfWeek: 5, startTime: '16:00', endTime: '17:00' },
      ],
    },
  },
  {
    firstName: 'Adam',
    lastName: 'Roche',
    dateOfBirth: new Date('2007-10-15'),
    instrument: 'Violoncelle',
    secondaryInstrument: null,
    level: 'PPES2',
    teacher: 'F. VOGHT',
    phone: '06 78 90 12 34',
    email: 'adam.roche@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 1, startTime: '14:00', endTime: '15:00' },
        { dayOfWeek: 4, startTime: '16:00', endTime: '17:00' },
      ],
    },
  },
  {
    firstName: 'Clara',
    lastName: 'Vincent',
    dateOfBirth: new Date('2009-08-21'),
    instrument: 'Piano',
    secondaryInstrument: null,
    level: '3CD3',
    teacher: 'J. MEUNIER',
    phone: '06 89 01 23 45',
    email: 'clara.vincent@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 2, startTime: '16:00', endTime: '17:00' },
        { dayOfWeek: 4, startTime: '14:00', endTime: '15:00' },
      ],
    },
  },
  {
    firstName: 'Victor',
    lastName: 'Chevalier',
    dateOfBirth: new Date('2006-12-04'),
    instrument: 'Hautbois',
    secondaryInstrument: 'Clarinette',
    level: '3CR2',
    teacher: 'F. VOGHT',
    phone: '06 90 12 34 56',
    email: 'victor.chevalier@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 1, startTime: '15:00', endTime: '16:00' },
        { dayOfWeek: 3, startTime: '14:00', endTime: '15:00' },
      ],
    },
  },
  {
    firstName: 'Léna',
    lastName: 'Marchand',
    dateOfBirth: new Date('2008-05-19'),
    instrument: 'Violon',
    secondaryInstrument: null,
    level: 'PPES1',
    teacher: 'J. MEUNIER',
    phone: '06 01 23 45 67',
    email: 'lena.marchand@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 2, startTime: '14:00', endTime: '15:00' },
        { dayOfWeek: 5, startTime: '15:00', endTime: '16:00' },
      ],
    },
  },
  {
    firstName: 'Robin',
    lastName: 'Dumont',
    dateOfBirth: new Date('2007-02-23'),
    instrument: 'Alto',
    secondaryInstrument: 'Violon',
    level: '3CD4',
    teacher: 'F. VOGHT',
    phone: '06 12 34 56 78',
    email: 'robin.dumont@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 3, startTime: '16:00', endTime: '17:00' },
        { dayOfWeek: 5, startTime: '14:00', endTime: '15:00' },
      ],
    },
  },
  {
    firstName: 'Jade',
    lastName: 'Lefevre',
    dateOfBirth: new Date('2009-09-10'),
    instrument: 'Clarinette',
    secondaryInstrument: null,
    level: '3CR1',
    teacher: 'J. MEUNIER',
    phone: '06 23 45 67 89',
    email: 'jade.lefevre@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 1, startTime: '16:00', endTime: '17:00' },
        { dayOfWeek: 4, startTime: '15:00', endTime: '16:00' },
      ],
    },
  },
  {
    firstName: 'Raphaël',
    lastName: 'Muller',
    dateOfBirth: new Date('2006-08-07'),
    instrument: 'Violoncelle',
    secondaryInstrument: null,
    level: 'PPES3',
    teacher: 'F. VOGHT',
    phone: '06 34 56 78 90',
    email: 'raphael.muller@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 2, startTime: '15:00', endTime: '16:00' },
        { dayOfWeek: 4, startTime: '16:00', endTime: '17:00' },
      ],
    },
  },
  {
    firstName: 'Louise',
    lastName: 'Blanchard',
    dateOfBirth: new Date('2008-03-30'),
    instrument: 'Piano',
    secondaryInstrument: null,
    level: '3CD1',
    teacher: 'J. MEUNIER',
    phone: '06 45 67 89 01',
    email: 'louise.blanchard@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 1, startTime: '14:00', endTime: '15:00' },
        { dayOfWeek: 3, startTime: '15:00', endTime: '16:00' },
      ],
    },
  },
  {
    firstName: 'Mathis',
    lastName: 'Guerin',
    dateOfBirth: new Date('2007-07-16'),
    instrument: 'Hautbois',
    secondaryInstrument: null,
    level: '3CR3',
    teacher: 'F. VOGHT',
    phone: '06 56 78 90 12',
    email: 'mathis.guerin@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 2, startTime: '16:00', endTime: '17:00' },
        { dayOfWeek: 5, startTime: '16:00', endTime: '17:00' },
      ],
    },
  },
  {
    firstName: 'Juliette',
    lastName: 'Boyer',
    dateOfBirth: new Date('2009-04-25'),
    instrument: 'Violon',
    secondaryInstrument: 'Piano',
    level: '3CD2',
    teacher: 'J. MEUNIER',
    phone: '06 67 89 01 23',
    email: 'juliette.boyer@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 3, startTime: '14:00', endTime: '15:00' },
        { dayOfWeek: 5, startTime: '15:00', endTime: '16:00' },
      ],
    },
  },
  {
    firstName: 'Ethan',
    lastName: 'Renard',
    dateOfBirth: new Date('2006-05-12'),
    instrument: 'Alto',
    secondaryInstrument: null,
    level: 'PPES2',
    teacher: 'F. VOGHT',
    phone: '06 78 90 12 34',
    email: 'ethan.renard@example.com',
    role: 'STUDENT',
    isActive: true,
    availabilities: {
      create: [
        { dayOfWeek: 1, startTime: '15:00', endTime: '16:00' },
        { dayOfWeek: 4, startTime: '14:00', endTime: '15:00' },
      ],
    },
  },
];

export async function POST() {
  try {
    // Supprimer d'abord toutes les disponibilités existantes
    await prisma.availability.deleteMany({
      where: {
        user: {
          role: 'STUDENT'
        }
      }
    });

    // Supprimer ensuite tous les étudiants existants
    await prisma.user.deleteMany({
      where: {
        role: 'STUDENT'
      }
    });

    // Créer les nouveaux étudiants avec leurs disponibilités
    for (const student of testStudents) {
      await prisma.user.create({
        data: student,
      });
    }

    return NextResponse.json({ message: 'Élèves de test ajoutés avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout des élèves de test:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout des élèves de test' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 