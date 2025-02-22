export const DAYS_OF_WEEK = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
];

export const INSTRUMENTS = [
  "Violon",
  "Alto",
  "Clarinette",
  "Violoncelle",
  "Contrebasse",
  "Piano",
  "Hautbois"
];

export interface Level {
  code: string;
  description: string;
}

export const LEVELS: Level[] = [
  { code: '3CD1', description: 'CEM 1ère année' },
  { code: '3CD2', description: 'CEM 2ème année' },
  { code: '3CD3', description: 'CEM 3ème année' },
  { code: '3CD4', description: 'CEM 4ème année' },
  { code: '3CRStage', description: 'Stage DEM' },
  { code: '3CR1', description: 'DEM 1ère année' },
  { code: '3CR2', description: 'DEM 2ème année' },
  { code: '3CR3', description: 'DEM 3ème année' },
  { code: '3CR4', description: 'DEM 4ème année' },
  { code: 'PPES1', description: 'PPES 1ère année' },
  { code: 'PPES2', description: 'PPES 2ème année' },
  { code: 'PPES3', description: 'PPES 3ème année' },
  { code: 'Contrat Niveau CEM', description: 'Hors Cursus niveau CEM' },
  { code: 'Contrat Niveau DEM', description: 'Hors Cursus niveau DEM' },
];

export const TEACHERS = [
  'J. MEUNIER',
  'F. VOGHT',
]; 