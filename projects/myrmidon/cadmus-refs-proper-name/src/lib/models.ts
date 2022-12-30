import { ThesaurusEntry } from "@myrmidon/cadmus-core";

/**
 * A piece of a proper name.
 */
export interface ProperNamePiece {
  type: string;
  value: string;
}

/**
 * A proper name.
 */
export interface ProperName {
  language: string;
  tag?: string;
  pieces: ProperNamePiece[];
}

/**
 * This entry type is used internally to represent piece types,
 * eventually with their prescribed ordinal number, allowed
 * value entries, and single status.
 */
export interface TypeThesaurusEntry extends ThesaurusEntry {
  ordinal?: number;
  single?: boolean;
  values?: ThesaurusEntry[];
}
