import { CodLocationParser } from './cod-location-parser';

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
  it('parseLocation should parse "x:12ra.3"', () => {
    const l = CodLocationParser.parseLocation('x:12ra.3');
    expect(l).toBeTruthy();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.v).toBeFalse();
    expect(l?.c).toBe('a');
    expect(l?.l).toBe(3);
  });
  it('parseLocation should parse "x:12va.3"', () => {
    const l = CodLocationParser.parseLocation('x:12va.3');
    expect(l).toBeTruthy();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.v).toBeTrue();
    expect(l?.c).toBe('a');
    expect(l?.l).toBe(3);
  });
  it('parseLocation should parse "x:12ra"', () => {
    const l = CodLocationParser.parseLocation('x:12ra');
    expect(l).toBeTruthy();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.v).toBeFalse();
    expect(l?.c).toBe('a');
    expect(l?.l).toBeUndefined();
  });
  it('parseLocation should parse "x:12r"', () => {
    const l = CodLocationParser.parseLocation('x:12r');
    expect(l).toBeTruthy();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.v).toBeFalse();
    expect(l?.c).toBeUndefined();
    expect(l?.l).toBeUndefined();
  });
  it('parseLocation should parse "x:12"', () => {
    const l = CodLocationParser.parseLocation('x:12');
    expect(l).toBeTruthy();
    expect(l?.s).toBe('x');
    expect(l?.n).toBe(12);
    expect(l?.v).toBeUndefined();
    expect(l?.c).toBeUndefined();
    expect(l?.l).toBeUndefined();
  });
  it('parseLocation should parse "12"', () => {
    const l = CodLocationParser.parseLocation('12');
    expect(l).toBeTruthy();
    expect(l?.s).toBeUndefined();
    expect(l?.n).toBe(12);
    expect(l?.v).toBeUndefined();
    expect(l?.c).toBeUndefined();
    expect(l?.l).toBeUndefined();
  });
  it('parseLocation should parse "12.3"', () => {
    const l = CodLocationParser.parseLocation('12.3');
    expect(l).toBeTruthy();
    expect(l?.s).toBeUndefined();
    expect(l?.n).toBe(12);
    expect(l?.v).toBeUndefined();
    expect(l?.c).toBeUndefined();
    expect(l?.l).toBe(3);
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
  // #endregion
});
