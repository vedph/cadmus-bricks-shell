import {
  CodLocationInterpolator,
  CodLocationInterpSystem,
} from './cod-location-interpolator';

describe('CodLocationInterpolator', () => {
  // Arabic
  it('interpolates Arabic 3-12', () => {
    const results = CodLocationInterpolator.interpolate(
      CodLocationInterpSystem.Arabic,
      '3',
      '12'
    );
    expect(results.length).toBe(10);
    for (let n = 3; n <= 12; n++) {
      expect(results[n - 3]).toBe(n.toString());
    }
  });
  // Roman upper
  it('interpolates Roman III-XII', () => {
    const results = CodLocationInterpolator.interpolate(
      CodLocationInterpSystem.RomanUpper,
      'III',
      'XII'
    );
    expect(results.length).toBe(10);
    const expected = [
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
      'X',
      'XI',
      'XII',
    ];
    for (let i = 0; i < 10; i++) {
      expect(results[i]).toBe(expected[i]);
    }
  });
  // Roman lower
  it('interpolates Roman iii-xii', () => {
    const results = CodLocationInterpolator.interpolate(
      CodLocationInterpSystem.RomanLower,
      'iii',
      'xii'
    );
    expect(results.length).toBe(10);
    const expected = [
      'iii',
      'iv',
      'v',
      'vi',
      'vii',
      'viii',
      'ix',
      'x',
      'xi',
      'xii',
    ];
    for (let i = 0; i < 10; i++) {
      expect(results[i]).toBe(expected[i]);
    }
  });
  // Alpha Latin upper
  it('interpolates alpha Latin C-N', () => {
    const results = CodLocationInterpolator.interpolate(
      CodLocationInterpSystem.AlphaLtUpper,
      'C',
      'N'
    );
    expect(results.length).toBe(10);
    const expected = [
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
    ];
    for (let i = 0; i < 10; i++) {
      expect(results[i]).toBe(expected[i]);
    }
  });
  // Alpha Latin lower
  it('interpolates alpha Latin c-n', () => {
    const results = CodLocationInterpolator.interpolate(
      CodLocationInterpSystem.AlphaLtLower,
      'c',
      'n'
    );
    expect(results.length).toBe(10);
    const expected = [
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'l',
      'm',
      'n',
    ];
    for (let i = 0; i < 10; i++) {
      expect(results[i]).toBe(expected[i]);
    }
  });
});
