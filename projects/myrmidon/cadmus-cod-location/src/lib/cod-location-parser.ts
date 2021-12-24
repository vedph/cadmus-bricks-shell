/**
 * Location in a manuscript's sheet.
 */
export interface CodLocation {
  /**
   * Reference system.
   */
  s?: string;
  /**
   * Sheet number.
   */
  n: number;
  /**
   * True if verso, false if recto.
   */
  v?: boolean;
  /**
   * Column number.
   */
  c?: string;
  /**
   * Line number.
   */
  l?: number;
}

/**
 * A range of manuscript's sheets.
 */
export interface CodLocationRange {
  start: CodLocation;
  end: CodLocation;
}

/**
 * Manuscript's location pattern. This refers to a text with format
 * [SYSTEM:]N[(r|v)[COLUMN]].LINE. Match groups are:
 * [1]=system: starts with a-z or A-Z and then contains only letters
 * a-z or A-Z, underscores, or digits 0-9. It is terminated by colon.
 * [2]=sheet: the sheet number. This is the only required component.
 * [3]=recto/verso: 'r' or 'v'.
 * [4]=column: the column letter(s) (column 1=a, 2=b, etc.).
 * [5]=line: the line number preceded by dot.
 */
export const COD_LOCATION_PATTERN =
  /(?:([a-zA-Z][_a-zA-Z0-9]*):)?([0-9]+)(?:([rv])([a-z])?)?(?:\.([0-9]+))?/;

/**
 * Manuscript's location parser.
 */
export class CodLocationParser {
  /**
   * Parse the pecified manuscript's location.
   *
   * @param text The text representing the location.
   * @returns Parsed location, or null if invalid.
   */
  public static parseLocation(
    text: string | undefined | null
  ): CodLocation | null {
    if (!text) {
      return null;
    }
    const m = COD_LOCATION_PATTERN.exec(text);
    if (!m) {
      return null;
    }
    return {
      s: m[1],
      n: +m[2],
      v: m[3] ? m[3] === 'v' : undefined,
      c: m[4],
      l: m[5] ? +m[5] : undefined,
    };
  }

  /**
   * Convert the specified location to its corresponding textual
   * representation.
   *
   * @param location The location if any.
   * @returns String or null.
   */
  public static locationToString(
    location: CodLocation | undefined | null
  ): string | null {
    if (!location) {
      return null;
    }
    const sb: string[] = [];
    // s:
    if (location.s) {
      sb.push(location.s);
      sb.push(':');
    }
    // n
    sb.push(location.n.toString());
    // v or r
    if (location.v !== undefined) {
      sb.push(location.v ? 'v' : 'r');
      // c
      if (location.c) {
        sb.push(location.c);
      }
    }
    // .l
    if (location.l) {
      sb.push('.');
      sb.push(location.l.toString());
    }
    return sb.join('');
  }

  /**
   * Parse manuscript's location ranges. Ranges between two locations A-B
   * are represented by location A plus dash plus location B. Several ranges
   * are separated by space.
   *
   * @param text The text with ranges.
   * @returns Ranges or null if invalid.
   */
  public static parseLocationRanges(
    text: string | undefined | null
  ): CodLocationRange[] | null {
    if (!text) {
      return null;
    }
    const ranges: CodLocationRange[] = [];

    // split at spaces, trim, and remove empty tokens
    const tokens = text
      .split(' ')
      .map((s) => s.trim())
      .filter((s) => s);

    tokens.forEach((token) => {
      // split each token at - (used for ranges)
      const rangeOrLoc = token.split('-');
      // range A-B: parse both
      if (rangeOrLoc.length === 2) {
        const start = CodLocationParser.parseLocation(rangeOrLoc[0]);
        const end = CodLocationParser.parseLocation(rangeOrLoc[1]);
        if (start && end) {
          ranges.push({
            start: start,
            end: end,
          });
        }
      } else {
        // single location: parse and set end=start
        const loc = CodLocationParser.parseLocation(rangeOrLoc[0]);
        if (loc) {
          ranges.push({
            start: loc,
            end: loc,
          });
        }
      }
    });
    return ranges;
  }

  /**
   * Convert the specified location ranges to text.
   *
   * @param ranges The ranges if any.
   * @returns String or null.
   */
  public static rangesToString(
    ranges: CodLocationRange[] | undefined | null
  ): string | null {
    if (!ranges?.length) {
      return null;
    }
    const sb: string[] = [];
    ranges.forEach((range) => {
      if (CodLocationParser.compareLocations(range.start, range.end) === 0) {
        const loc = CodLocationParser.locationToString(range.start);
        if (loc) {
          sb.push(loc);
        }
      } else {
        const a = CodLocationParser.locationToString(range.start);
        const b = CodLocationParser.locationToString(range.end);
        if (a && b) {
          sb.push(a);
          sb.push('-');
          sb.push(b);
        }
      }
    });
    return sb.join('');
  }

  /**
   * Compare two locations.
   *
   * @param a The first location if any.
   * @param b The second location if any.
   * @returns 0=equal, less than 0=A < B, greater than 0=A > B.
   */
  public static compareLocations(
    a: CodLocation | undefined | null,
    b: CodLocation | undefined | null
  ): number {
    // two falsy locations are equal
    if (!a && !b) {
      return 0;
    }
    // a falsy vs non-falsy location comes before
    if (!a) {
      return 1;
    }
    if (!b) {
      return -1;
    }
    if ((!a.s && !b.s) || a.s === b.s) {
      // systems are equal: compare n
      if (a.n !== b.n) {
        return a.n - b.n;
      }
      // n are equal: compare rv (r precedes v)
      if (a.v !== b.v) {
        return a.v ? 1 : -1;
      }
      // v are equal: compare c
      if ((a.c && !b.c) || (!a.c && b.c) || a.c !== b.c) {
        if (!a.c) {
          return -1;
        }
        if (!b.c) {
          return 1;
        }
        return a.c.localeCompare(b.c);
      }
      // c are equal: compare l
      if ((!a.l && !b.l) || a.l === b.l) {
        return 0;
      }
      return a.l! - b.l!;
    } else {
      // systems are different, just compare them
      if (!a.s) {
        return -1;
      }
      if (!b.s) {
        return 1;
      }
      return a.s.localeCompare(b.s);
    }
  }
}
