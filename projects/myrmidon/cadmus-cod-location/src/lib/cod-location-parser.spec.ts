import { CodLocationEndleaf, CodLocationParser } from './cod-location-parser';

describe('CodLocationParser', () => {
  // #region parseLocation
  it('parseLocation should parse null as null', () => {
    expect(CodLocationParser.parseLocation(null)).toBeNull();
  });
  it('parseLocation should parse undefined as null', () => {
    expect(CodLocationParser.parseLocation(undefined)).toBeNull();
  });
  it('parseLocation should parse empty as null', () => {
    expect(CodLocationParser.parseLocation('')).toBeNull();
  });
  it('parseLocation should parse "(x:^12)"', () => {
    const l = CodLocationParser.parseLocation('(x:^12)');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBe(CodLocationEndleaf.FrontEndleaf);
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeTrue();
    expect(l?.sfx).toBeUndefined();
    expect(l?.v).toBeUndefined();
    expect(l?.c).toBeUndefined();
    expect(l?.l).toBeUndefined();
    expect(l?.word).toBeUndefined();
  });
  it('parseLocation should parse "(/x:^12)"', () => {
    const l = CodLocationParser.parseLocation('(/x:^12)');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBe(CodLocationEndleaf.BackEndleaf);
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeTrue();
    expect(l?.sfx).toBeUndefined();
    expect(l?.v).toBeUndefined();
    expect(l?.c).toBeUndefined();
    expect(l?.l).toBeUndefined();
    expect(l?.word).toBeUndefined();
  });
  it('parseLocation should parse "x:^12"bis"ra.3"', () => {
    const l = CodLocationParser.parseLocation('x:^12"bis"ra.3');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBeUndefined();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeTrue();
    expect(l?.sfx).toBe('bis');
    expect(l?.v).toBeFalse();
    expect(l?.c).toBe('a');
    expect(l?.l).toBe(3);
    expect(l?.word).toBeUndefined();
  });
  it('parseLocation should parse "x:^12"bis"ra.3@exemplum"', () => {
    const l = CodLocationParser.parseLocation('x:^12"bis"ra.3@exemplum');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBeUndefined();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeTrue();
    expect(l?.sfx).toBe('bis');
    expect(l?.v).toBeFalse();
    expect(l?.c).toBe('a');
    expect(l?.l).toBe(3);
    expect(l?.word).toBe('exemplum');
  });
  it('parseLocation should parse "x:^12ra.3"', () => {
    const l = CodLocationParser.parseLocation('x:^12ra.3');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBeUndefined();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeTrue();
    expect(l?.sfx).toBeUndefined();
    expect(l?.v).toBeFalse();
    expect(l?.c).toBe('a');
    expect(l?.l).toBe(3);
    expect(l?.word).toBeUndefined();
  });
  it('parseLocation should parse "x:12"bis"ra.3"', () => {
    const l = CodLocationParser.parseLocation('x:12"bis"ra.3');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBeUndefined();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeUndefined();
    expect(l?.sfx).toBe('bis');
    expect(l?.v).toBeFalse();
    expect(l?.c).toBe('a');
    expect(l?.l).toBe(3);
    expect(l?.word).toBeUndefined();
  });
  it('parseLocation should parse "x:12ra.3"', () => {
    const l = CodLocationParser.parseLocation('x:12ra.3');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBeUndefined();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeUndefined();
    expect(l?.sfx).toBeUndefined();
    expect(l?.v).toBeFalse();
    expect(l?.c).toBe('a');
    expect(l?.l).toBe(3);
    expect(l?.word).toBeUndefined();
  });
  it('parseLocation should parse "x:12va.3"', () => {
    const l = CodLocationParser.parseLocation('x:12va.3');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBeUndefined();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeUndefined();
    expect(l?.sfx).toBeUndefined();
    expect(l?.v).toBeTrue();
    expect(l?.c).toBe('a');
    expect(l?.l).toBe(3);
    expect(l?.word).toBeUndefined();
  });
  it('parseLocation should parse "x:12ra"', () => {
    const l = CodLocationParser.parseLocation('x:12ra');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBeUndefined();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeUndefined();
    expect(l?.sfx).toBeUndefined();
    expect(l?.v).toBeFalse();
    expect(l?.c).toBe('a');
    expect(l?.l).toBeUndefined();
    expect(l?.word).toBeUndefined();
  });
  it('parseLocation should parse "x:12r"', () => {
    const l = CodLocationParser.parseLocation('x:12r');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBeUndefined();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeUndefined();
    expect(l?.sfx).toBeUndefined();
    expect(l?.v).toBeFalse();
    expect(l?.c).toBeUndefined();
    expect(l?.l).toBeUndefined();
    expect(l?.word).toBeUndefined();
  });
  it('parseLocation should parse "x:12"bis"r"', () => {
    const l = CodLocationParser.parseLocation('x:12"bis"r');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBeUndefined();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeUndefined();
    expect(l?.sfx).toBe('bis');
    expect(l?.v).toBeFalse();
    expect(l?.c).toBeUndefined();
    expect(l?.l).toBeUndefined();
    expect(l?.word).toBeUndefined();
  });
  it('parseLocation should parse "x:12a"', () => {
    const l = CodLocationParser.parseLocation('x:12a');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBeUndefined();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeUndefined();
    expect(l?.sfx).toBeUndefined();
    expect(l?.v).toBeUndefined();
    expect(l?.c).toBe('a');
    expect(l?.l).toBeUndefined();
    expect(l?.word).toBeUndefined();
  });
  it('parseLocation should parse "x:12"', () => {
    const l = CodLocationParser.parseLocation('x:12');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBeUndefined();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeUndefined();
    expect(l?.sfx).toBeUndefined();
    expect(l?.v).toBeUndefined();
    expect(l?.c).toBeUndefined();
    expect(l?.l).toBeUndefined();
    expect(l?.word).toBeUndefined();
  });
  it('parseLocation should parse "12"', () => {
    const l = CodLocationParser.parseLocation('12');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBeUndefined();
    expect(l?.s).toBeUndefined();
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeUndefined();
    expect(l?.sfx).toBeUndefined();
    expect(l?.v).toBeUndefined();
    expect(l?.c).toBeUndefined();
    expect(l?.l).toBeUndefined();
    expect(l?.word).toBeUndefined();
  });
  it('parseLocation should parse "12.3"', () => {
    const l = CodLocationParser.parseLocation('12.3');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBeUndefined();
    expect(l?.s).toBeUndefined();
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeUndefined();
    expect(l?.sfx).toBeUndefined();
    expect(l?.v).toBeUndefined();
    expect(l?.c).toBeUndefined();
    expect(l?.l).toBe(3);
    expect(l?.word).toBeUndefined();
  });
  it('parseLocation should parse "n.roman:12.3"', () => {
    const l = CodLocationParser.parseLocation('n.roman:12.3');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBeUndefined();
    expect(l?.s).toBe('n.roman');
    expect(l?.n).toBe(12);
    expect(l?.rmn).toBeUndefined();
    expect(l?.sfx).toBeUndefined();
    expect(l?.v).toBeUndefined();
    expect(l?.c).toBeUndefined();
    expect(l?.l).toBe(3);
    expect(l?.word).toBeUndefined();
  });
  it('parseLocation should parse ""suffix""', () => {
    const l = CodLocationParser.parseLocation('"suffix"');
    expect(l).toBeTruthy();
    expect(l?.endleaf).toBeUndefined();
    expect(l?.s).toBeUndefined();
    expect(l?.n).toBe(0);
    expect(l?.rmn).toBeUndefined();
    expect(l?.sfx).toBe('suffix');
    expect(l?.v).toBeUndefined();
    expect(l?.c).toBeUndefined();
    expect(l?.l).toBeUndefined();
    expect(l?.word).toBeUndefined();
  });
  // #endregion

  // #region locationToString
  it('locationToString should ret null from null', () => {
    expect(CodLocationParser.locationToString(null)).toBeNull();
  });
  it('locationToString should ret null from undefined', () => {
    expect(CodLocationParser.locationToString(undefined)).toBeNull();
  });
  it('locationToString should ret "12" from 12', () => {
    expect(CodLocationParser.locationToString({ n: 12 })).toBe('12');
  });
  it('locationToString should ret "12r" from 12r', () => {
    expect(CodLocationParser.locationToString({ n: 12, v: false })).toBe('12r');
  });
  it('locationToString should ret "12v" from 12v', () => {
    expect(CodLocationParser.locationToString({ n: 12, v: true })).toBe('12v');
  });
  it('locationToString should ret "12.3" from 12.3', () => {
    expect(CodLocationParser.locationToString({ n: 12, l: 3 })).toBe('12.3');
  });
  it('locationToString should ret "12r.3" from 12r.3', () => {
    expect(CodLocationParser.locationToString({ n: 12, v: false, l: 3 })).toBe(
      '12r.3'
    );
  });
  it('locationToString should ret "12ra.3" from 12ra.3', () => {
    expect(
      CodLocationParser.locationToString({ n: 12, v: false, c: 'a', l: 3 })
    ).toBe('12ra.3');
  });
  it('locationToString should ret "x:12ra.3" from x:12ra.3', () => {
    expect(
      CodLocationParser.locationToString({ s: 'x', n: 12, v: false, l: 3 })
    ).toBe('x:12r.3');
  });
  it('locationToString should ret "(x:^12)" from (x:^12)', () => {
    expect(
      CodLocationParser.locationToString({
        endleaf: CodLocationEndleaf.FrontEndleaf,
        s: 'x',
        n: 12,
        rmn: true,
      })
    ).toBe('(x:^12)');
  });
  it('locationToString should ret "(/x:^12)" from (/x:^12)', () => {
    expect(
      CodLocationParser.locationToString({
        endleaf: CodLocationEndleaf.BackEndleaf,
        s: 'x',
        n: 12,
        rmn: true,
      })
    ).toBe('(/x:^12)');
  });
  // #endregion

  // #region parseLocationRanges
  it('parseLocationRanges should parse null as null', () => {
    expect(CodLocationParser.parseLocationRanges(null)).toBeNull();
  });
  it('parseLocationRanges should parse undefined as null', () => {
    expect(CodLocationParser.parseLocationRanges(undefined)).toBeNull();
  });
  it('parseLocationRanges should parse empty as null', () => {
    expect(CodLocationParser.parseLocationRanges('')).toBeNull();
  });
  it('parseLocationRanges should parse "1"', () => {
    const ranges = CodLocationParser.parseLocationRanges('1');
    expect(ranges?.length).toBe(1);
    expect(ranges![0].start.n).toBe(1);
    expect(ranges![0].end.n).toBe(1);
  });
  it('parseLocationRanges should parse "1-3"', () => {
    const ranges = CodLocationParser.parseLocationRanges('1-3');
    expect(ranges?.length).toBe(1);
    expect(ranges![0].start.n).toBe(1);
    expect(ranges![0].end.n).toBe(3);
  });
  it('parseLocationRanges should parse "1r-3v"', () => {
    const ranges = CodLocationParser.parseLocationRanges('1r-3v');
    expect(ranges?.length).toBe(1);
    expect(ranges![0].start.n).toBe(1);
    expect(ranges![0].start.v).toBeFalse();
    expect(ranges![0].end.n).toBe(3);
    expect(ranges![0].end.v).toBeTrue();
  });
  it('parseLocationRanges should parse "1ra.12-3vb.4"', () => {
    const ranges = CodLocationParser.parseLocationRanges('1ra.12-3vb.4');
    expect(ranges?.length).toBe(1);
    expect(ranges![0].start.n).toBe(1);
    expect(ranges![0].start.v).toBeFalse();
    expect(ranges![0].start.c).toBe('a');
    expect(ranges![0].start.l).toBe(12);
    expect(ranges![0].end.n).toBe(3);
    expect(ranges![0].end.v).toBeTrue();
    expect(ranges![0].end.c).toBe('b');
    expect(ranges![0].end.l).toBe(4);
  });
  it('parseLocationRanges should parse "1r-3v 4r 7r-11v"', () => {
    const ranges = CodLocationParser.parseLocationRanges('1r-3v 4r 7r-11v');
    expect(ranges?.length).toBe(3);
    expect(ranges![0].start.n).toBe(1);
    expect(ranges![0].start.v).toBeFalse();
    expect(ranges![0].end.n).toBe(3);
    expect(ranges![0].end.v).toBeTrue();

    expect(ranges![1].start.n).toBe(4);
    expect(ranges![1].start.v).toBeFalse();
    expect(ranges![1].end.n).toBe(4);
    expect(ranges![1].end.v).toBeFalse();

    expect(ranges![2].start.n).toBe(7);
    expect(ranges![2].start.v).toBeFalse();
    expect(ranges![2].end.n).toBe(11);
    expect(ranges![2].end.v).toBeTrue();
  });
  // #endregion

  // #region rangesToString
  it('rangesToString should ret null from null', () => {
    expect(CodLocationParser.rangesToString(null)).toBeNull();
  });
  it('rangesToString should ret null from undefined', () => {
    expect(CodLocationParser.rangesToString(undefined)).toBeNull();
  });
  it('rangesToString should ret 1 from 1', () => {
    expect(
      CodLocationParser.rangesToString([
        {
          start: {
            n: 1,
          },
          end: {
            n: 1,
          },
        },
      ])
    ).toBe('1');
  });
  it('rangesToString should ret 1r from 1r', () => {
    expect(
      CodLocationParser.rangesToString([
        {
          start: {
            n: 1,
            v: false,
          },
          end: {
            n: 1,
            v: false,
          },
        },
      ])
    ).toBe('1r');
  });
  it('rangesToString should ret 1v from 1v', () => {
    expect(
      CodLocationParser.rangesToString([
        {
          start: {
            n: 1,
            v: true,
          },
          end: {
            n: 1,
            v: true,
          },
        },
      ])
    ).toBe('1v');
  });
  it('rangesToString should ret 12va from 12va', () => {
    expect(
      CodLocationParser.rangesToString([
        {
          start: {
            n: 12,
            v: true,
            c: 'a',
          },
          end: {
            n: 12,
            v: true,
            c: 'a',
          },
        },
      ])
    ).toBe('12va');
  });
  it('rangesToString should ret 12va.3 from 12va.3', () => {
    expect(
      CodLocationParser.rangesToString([
        {
          start: {
            n: 12,
            v: true,
            c: 'a',
            l: 3,
          },
          end: {
            n: 12,
            v: true,
            c: 'a',
            l: 3,
          },
        },
      ])
    ).toBe('12va.3');
  });
  it('rangesToString should ret x:12va.3 from x:12va.3', () => {
    expect(
      CodLocationParser.rangesToString([
        {
          start: {
            s: 'x',
            n: 12,
            v: true,
            c: 'a',
            l: 3,
          },
          end: {
            s: 'x',
            n: 12,
            v: true,
            c: 'a',
            l: 3,
          },
        },
      ])
    ).toBe('x:12va.3');
  });
  it('rangesToString should ret x:12va.3@exemplum from x:12va.3@exemplum', () => {
    expect(
      CodLocationParser.rangesToString([
        {
          start: {
            s: 'x',
            n: 12,
            v: true,
            c: 'a',
            l: 3,
            word: 'exemplum'
          },
          end: {
            s: 'x',
            n: 12,
            v: true,
            c: 'a',
            l: 3,
            word: 'exemplum'
          },
        },
      ])
    ).toBe('x:12va.3@exemplum');
  });
  it('rangesToString should ret x:12va.3-x:13r.2 from x:12va.3-x:13r.2', () => {
    expect(
      CodLocationParser.rangesToString([
        {
          start: {
            s: 'x',
            n: 12,
            v: true,
            c: 'a',
            l: 3,
          },
          end: {
            s: 'x',
            n: 13,
            v: false,
            l: 2,
          },
        },
      ])
    ).toBe('x:12va.3-x:13r.2');
  });
  // #endregion

  // #region compareLocations
  it('compareLocations null vs null should ret 0', () => {
    expect(CodLocationParser.compareLocations(null, null)).toBe(0);
  });
  it('compareLocations null vs undefined should ret 0', () => {
    expect(CodLocationParser.compareLocations(null, undefined)).toBe(0);
  });
  it('compareLocations undefined vs null should ret 0', () => {
    expect(CodLocationParser.compareLocations(undefined, null)).toBe(0);
  });
  it('compareLocations null vs 1 should ret <0', () => {
    expect(CodLocationParser.compareLocations(null, { n: 1 })).toBeLessThan(0);
  });
  it('compareLocations 1 vs null should ret >0', () => {
    expect(CodLocationParser.compareLocations({ n: 1 }, null)).toBeGreaterThan(
      0
    );
  });
  it('compareLocations 1 vs 1 should ret 0', () => {
    expect(CodLocationParser.compareLocations({ n: 1 }, { n: 1 })).toBe(0);
  });
  it('compareLocations x:12ra.3 vs x:12ra.3 should ret 0', () => {
    expect(
      CodLocationParser.compareLocations(
        { s: 'x', n: 12, v: false, c: 'a', l: 3 },
        { s: 'x', n: 12, v: false, c: 'a', l: 3 }
      )
    ).toBe(0);
  });
  it('compareLocations x:12ra.3 vs y:12ra.3 should ret <0', () => {
    expect(
      CodLocationParser.compareLocations(
        { s: 'x', n: 12, v: false, c: 'a', l: 3 },
        { s: 'y', n: 12, v: false, c: 'a', l: 3 }
      )
    ).toBeLessThan(0);
  });
  it('compareLocations x:11ra.3 vs x:12ra.3 should ret <0', () => {
    expect(
      CodLocationParser.compareLocations(
        { s: 'x', n: 11, v: false, c: 'a', l: 3 },
        { s: 'x', n: 12, v: false, c: 'a', l: 3 }
      )
    ).toBeLessThan(0);
  });
  it('compareLocations x:12ra.3 vs x:12va.3 should ret <0', () => {
    expect(
      CodLocationParser.compareLocations(
        { s: 'x', n: 12, v: false, c: 'a', l: 3 },
        { s: 'x', n: 12, v: true, c: 'a', l: 3 }
      )
    ).toBeLessThan(0);
  });
  it('compareLocations x:12ra.3 vs x:12rb.3 should ret <0', () => {
    expect(
      CodLocationParser.compareLocations(
        { s: 'x', n: 12, v: false, c: 'a', l: 3 },
        { s: 'x', n: 12, v: false, c: 'b', l: 3 }
      )
    ).toBeLessThan(0);
  });
  it('compareLocations x:12ra.3 vs x:12ra.5 should ret <0', () => {
    expect(
      CodLocationParser.compareLocations(
        { s: 'x', n: 12, v: false, c: 'a', l: 3 },
        { s: 'x', n: 12, v: false, c: 'a', l: 5 }
      )
    ).toBeLessThan(0);
  });
  // #endregion
});
