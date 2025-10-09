import { JsonValue } from 'generated/prisma/runtime/library';

export type UserProfile = {
  id: number;
  userId: number;
  sex: string | null;
  birthDate: Date | null;
  heightCm: number | null;
  weightKg: number | null;
  bmi: number | null;
  prefs: JsonValue;
};

export type Prefs = {
  diet?: string;

  allergies?: string[];
};
