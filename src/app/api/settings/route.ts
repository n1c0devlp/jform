import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json();

    // Chemin vers le fichier des constantes
    const constantsPath = path.join(process.cwd(), 'src', 'lib', 'constants.ts');

    // Lire le contenu actuel du fichier
    let content = await fs.readFile(constantsPath, 'utf8');

    // Préparer les nouvelles données au format TypeScript
    let newData = '';
    if (type === 'levels') {
      newData = `export const LEVELS: Level[] = ${JSON.stringify(data, null, 2)};`;
    } else if (type === 'instruments') {
      newData = `export const INSTRUMENTS = ${JSON.stringify(data, null, 2)};`;
    } else if (type === 'teachers') {
      newData = `export const TEACHERS = ${JSON.stringify(data, null, 2)};`;
    }

    // Remplacer la section correspondante dans le fichier
    const regex = new RegExp(`export const ${type.toUpperCase()} = [\\s\\S]*?;`);
    content = content.replace(regex, newData);

    // Écrire le fichier mis à jour
    await fs.writeFile(constantsPath, content, 'utf8');

    return NextResponse.json({ message: 'Paramètres mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres' },
      { status: 500 }
    );
  }
} 