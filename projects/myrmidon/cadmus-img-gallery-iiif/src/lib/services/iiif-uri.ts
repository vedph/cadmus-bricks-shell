// https://iiif.io/api/image/3.0/#image-request-uri-syntax
// This is just a stub for a more complete implementation.
// TODO: implement full IIIF parsing and model

/**
 * An IIIF image URI like
 * baseURL/identifier/region/size/rotation/quality.format.
 */
export class IiifUri {
  public baseUrl: string;
  public identifier: string;
  public region: string;
  public size: string;
  public rotation: string;
  public quality: string;
  public format: string;

  constructor() {
    this.baseUrl = '';
    this.identifier = '';
    this.region = 'full';
    this.size = 'max';
    this.rotation = '0';
    this.quality = 'default';
    this.format = 'jpg';
  }

  public static parse(uri: string): IiifUri | null {
    if (!uri) {
      return null;
    }
    const parts = uri.split('/');
    if (parts.length !== 6) {
      return null;
    }
    // last part is quality.format
    const i = parts[5].lastIndexOf('.');
    if (i === -1 || i === parts[5].length - 1) {
      return null;
    }
    return {
      baseUrl: parts[0],
      identifier: parts[1],
      region: parts[2],
      size: parts[3],
      rotation: parts[4],
      quality: parts[5].substring(0, i),
      format: parts[5].substring(i + 1),
    };
  }

  public toString(): string {
    return (
      [
        this.baseUrl,
        this.identifier,
        this.region,
        this.size,
        this.rotation,
        this.quality,
      ].join('/') + `.${this.format}`
    );
  }
}
