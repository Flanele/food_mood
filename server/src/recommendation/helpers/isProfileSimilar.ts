import { getAge } from 'src/lib/utils/get-age';

const AGE_DIFF_YEARS = 7;
const BMI_DIFF = 3;

export function isProfileSimilar(
  me: { age: number | null; sex: string | null; bmi: number | null },
  peer: { birthDate?: Date | null; sex?: string | null; bmi?: number | null },
) {
    
  const peerAge = peer.birthDate ? getAge(peer.birthDate) : null;
  const ageClose =
    me.age !== null && peerAge !== null
      ? Math.abs(peerAge - me.age) <= AGE_DIFF_YEARS
      : false;

  const bmiClose =
    me.bmi !== null && typeof peer.bmi === 'number'
      ? Math.abs(peer.bmi - me.bmi) <= BMI_DIFF
      : false;

  const sexSame = !!me.sex && !!peer.sex && me.sex === peer.sex;

  return ageClose || bmiClose || sexSame;
}
