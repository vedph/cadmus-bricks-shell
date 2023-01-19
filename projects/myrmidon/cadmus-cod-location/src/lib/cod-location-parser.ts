/**
 * Endleaf type in CodLocation.
 */
export enum CodLocationEndleaf {
  None = 0,
  Start = 1,
  End = 2,
}

/**
 * Location in a manuscript's sheet.
 */
export interface CodLocation {
  /**
   * Endleaf type.
   */
  endleaf?: CodLocationEndleaf;
  /**
   * Reference system.
   */
  s?: string;
  /**
   * Sheet number.
   */
  n: number;
  /**
   * True if n is to be displayed with the Roman numeral system.
   */
  rmn?: boolean;
  /**
   * An arbitrary suffix appended to n (e.g. "bis").
   */
  sfx?: string;
  /**
   * True if verso, false if recto; undefined if not specified/applicable.
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
  /**
   * The word we refer to. By scholarly convention, this is a word
   * picked from the line so that it cannot be ambiguous, i.e. confused
   * with other instances of the same word in its line.
   */
  word?: string;
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
 * (/[SYSTEM:]N[(r|v)[COLUMN]].LINE). Match groups are:
 * [1]=endleaf, optional: ( for start or (/ for end.
 * [2]=system: starts with a-z or A-Z and then contains only letters
 * a-z or A-Z, underscores, dots, or digits 0-9. It is terminated by colon.
 * [3]='^' for a Roman number.
 * [4]=sheet: the sheet number.
 * [5]=suffix between "".
 * [6]=recto/verso: 'r' or 'v', otherwise unspecified/not applicable.
 * [7]=column: the column letter(s) (column 1=a, 2=b, etc.: a-q).
 * [8]=line: the line number preceded by dot.
 * [9]=word preceded by @.
 */
export const COD_LOCATION_PATTERN =
  /^(\(\/?)?(?:([a-zA-Z][_.a-zA-Z0-9]*):)?(\^)?([0-9]*)(?:"([^"]*)")?([rv])?([a-q])?(?:\.([0-9]+))?(?:@([\p{L}]+))?\)?$/u;

export const COD_LOCATION_RANGES_PATTERN =
  /^(?:(?:\(\/?)?(?:(?:[a-zA-Z][_.a-zA-Z0-9]*):)?(?:\^)?(?:[0-9]*)(?:"([^"]*)")?(?:[rv])?(?:[a-q])?(?:\.(?:[0-9]+))?(?:@([\p{L}]+))?\)?[- ]?)+$/u;

// group numbers in pattern
const P_LEAF = 1;
const P_S = 2;
const P_RMN = 3;
const P_N = 4;
const P_SFX = 5;
const P_V = 6;
const P_C = 7;
const P_L = 8;
const P_WORD = 9;

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
      endleaf: m[P_LEAF]
        ? m[P_LEAF] === '(/'
          ? CodLocationEndleaf.End
          : CodLocationEndleaf.Start
        : undefined,
      s: m[P_S],
      n: m[P_N] ? +m[P_N] : 0,
      rmn: m[P_RMN] ? true : undefined,
      sfx: m[P_SFX],
      v: m[P_V] ? m[P_V] === 'v' : undefined,
      c: m[P_C],
      l: m[P_L] ? +m[P_L] : undefined,
      word: m[P_WORD],
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
    // leaf
    if (location.endleaf) {
      sb.push(location.endleaf === CodLocationEndleaf.End ? '(/' : '(');
    }
    // s:
    if (location.s) {
      sb.push(location.s);
      sb.push(':');
    }
    // rmn
    if (location.rmn) {
      sb.push('^');
    }
    // n
    if (location.n) {
      sb.push(location.n.toString());
    }
    // sfx
    if (location.sfx) {
      sb.push(`"${location.sfx}"`);
    }
    // v or r
    if (location.v !== undefined) {
      sb.push(location.v ? 'v' : 'r');
    }
    // c
    if (location.c) {
      sb.push(location.c);
    }
    // .l
    if (location.l) {
      sb.push('.');
      sb.push(location.l.toString());
    }
    // @word
    if (location.word) {
      sb.push('@');
      sb.push(location.word);
    }
    // leaf
    if (location.endleaf) {
      sb.push(')');
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
      if (sb.length) {
        sb.push(' ');
      }
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
      return -1;
    }
    if (!b) {
      return 1;
    }

    // endleaf: start endleaf always comes before any other type;
    // end endleaf always come after any other type.
    if (
      (a.endleaf || CodLocationEndleaf.None) !==
      (b.endleaf || CodLocationEndleaf.None)
    ) {
      // a=start, b=none/end
      if (a.endleaf === CodLocationEndleaf.Start) return -1;
      // b=start, a=none/end
      if (b.endleaf === CodLocationEndleaf.Start) return 1;
      // a=none, b=end / a=end, b=none
      return (a.endleaf || CodLocationEndleaf.None) === CodLocationEndleaf.None
        ? -1
        : 1;
    }
    // systems
    if ((!a.s && !b.s) || a.s === b.s) {
      // systems are equal: compare n
      if (a.n !== b.n) {
        const na = a.n === null || a.n === undefined? 0 : a.n;
        const nb = b.n === null || b.n === undefined? 0 : b.n;
        return na - nb;
      }
      // n are equal: compare sfx
      if ((a.sfx || b.sfx) && a.sfx !== b.sfx) {
        return a.sfx ? 1 : -1;
      }
      // sfx are equal: compare rv (r precedes v)
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
      if (a.l !== b.l) {
        return a.l! - b.l!;
      }
      // l are equal: compare word.
      // Note that in this case we just sort by word alphabetically,
      // as we could not know which of 2 words comes first.
      if (!a.word && !b.word) {
        return 0;
      }
      if (!a.word) {
        return -1;
      }
      if (!b.word) {
        return 1;
      }
      return a.word.localeCompare(b.word);
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
