/**
 * A part of a PersonName.
 */
 export interface PersonNamePart {
  type: string;
  value: string;
}

/**
 * A person name.
 */
export interface PersonName {
  language: string;
  tag?: string;
  parts: PersonNamePart[];
}
