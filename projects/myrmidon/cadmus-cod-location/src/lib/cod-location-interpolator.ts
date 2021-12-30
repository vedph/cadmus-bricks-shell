import { RomanNumber } from '@myrmidon/ng-tools';

const ALPHA_IT = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'X',
  'Y',
  'Z',
];
const ALPHA_LT = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'V',
  'X',
  'Y',
  'Z',
];
const ALPHA_EN = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];
const ALPHA_EL = [
  'Α',
  'Β',
  'Γ',
  'Δ',
  'Ε',
  'Ϝ',
  'Ζ',
  'Η',
  'Θ',
  'Ι',
  'Κ',
  'Λ',
  'Μ',
  'Ν',
  'Ξ',
  'Ο',
  'Π',
  'Ϙ',
  'Ρ',
  'Σ',
  'Τ',
  'Υ',
  'Φ',
  'Χ',
  'Ψ',
  'Ω',
  'Ϡ',
];

export enum CodLocationInterpSystem {
  Arabic = 0,
  RomanUpper,
  RomanLower,
  AlphaElUpper,
  AlphaElLower,
  AlphaLtUpper,
  AlphaLtLower,
  AlphaItUpper,
  AlphaItLower,
}

export class CodLocationInterpolator {
  private static getArabic(start: string, end: string): string[] {
    const a = +start;
    const b = +end;
    if (b < a) {
      return [start, end];
    }
    const results: string[] = [];
    for (let n = a; n <= b; n++) {
      results.push(n.toString());
    }
    return results;
  }

  private static getRoman(start: string, end: string, lower = false): string[] {
    const a = RomanNumber.fromRoman(start.toUpperCase());
    const b = RomanNumber.fromRoman(end.toUpperCase());
    if (!a || !b || b < a) {
      return [start, end];
    }
    const results: string[] = [];
    for (let n = a; n <= b; n++) {
      const r = RomanNumber.toRoman(n);
      results.push(lower ? r.toLowerCase() : r);
    }
    return results;
  }

  private static getAlpha(
    start: string,
    end: string,
    letters: string[],
    lower = false
  ): string[] {
    const a = letters.indexOf(start.toUpperCase());
    const b = letters.indexOf(end.toUpperCase());
    if (a === -1 || b === -1 || b < a) {
      return [start, end];
    }
    const results: string[] = [];
    for (let i = a; i <= b; i++) {
      results.push(lower ? letters[i].toLowerCase() : letters[i]);
    }
    return results;
  }

  public static interpolate(
    system: CodLocationInterpSystem,
    start: string,
    end: string
  ): string[] {
    switch (system) {
      case CodLocationInterpSystem.Arabic:
        return this.getArabic(start, end);
      case CodLocationInterpSystem.RomanUpper:
        return this.getRoman(start, end);
      case CodLocationInterpSystem.RomanLower:
        return this.getRoman(start, end, true);
      case CodLocationInterpSystem.AlphaElUpper:
        return this.getAlpha(start, end, ALPHA_EL);
      case CodLocationInterpSystem.AlphaElLower:
        return this.getAlpha(start, end, ALPHA_EL, true);
      case CodLocationInterpSystem.AlphaLtUpper:
        return this.getAlpha(start, end, ALPHA_LT);
      case CodLocationInterpSystem.AlphaLtLower:
        return this.getAlpha(start, end, ALPHA_LT, true);
      case CodLocationInterpSystem.AlphaItUpper:
        return this.getAlpha(start, end, ALPHA_IT);
      case CodLocationInterpSystem.AlphaItUpper:
        return this.getAlpha(start, end, ALPHA_IT, true);
      default:
        return [start, end];
    }
  }
}
