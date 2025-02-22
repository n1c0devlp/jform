export interface TimeSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface StudentInfo {
  firstName: string;
  lastName: string;
  age: number | null;
  instrument: string;
  secondaryInstrument: string | null;
  level: string; // Code du niveau (ex: '3CD1', 'PPES1', etc.)
  teacher: string;
  phone: string;
  email: string;
}

export interface StudentInfoErrors {
  firstName?: string;
  lastName?: string;
  age?: string;
  phone?: string;
  email?: string;
} 