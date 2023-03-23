// https://iiif.io/api/image/3.0/#image-request-uri-syntax
// This is just a stub for a more complete implementation.
// TODO: implement full IIIF parsing and model

// {scheme}://{server}{/prefix}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}
// - server
// - prefix
// - identifier: any
//
// - region: "full" | "square" | "x,y,w,h" | "pct:x,y,w,h"
// - size: "max" | "^max" | "w," | "^w," | ",h" | "^,h" | "pct:n" | "^pct:n" | "w,h" | "^w,h" | "!w,h" | "^!w,h"
// - rotation: "n" | "!n"
// - quality: "default" | "color" | "gray" | "bitonal"
// - format: "jpg" | "tif" | "png" | "gif" | "jp2" | "pdf" | "webp"
//
// All special chars (including / which is used as separator) are to be URL-encoded.

/**
 * An IIIF image URI.
 */
export class IiifUri {
  public scheme: 'http' | 'https';
  public server: string;
  public prefix: string;
  public identifier: string;
  public region: string;
  public size: string;
  public rotation: string;
  public quality: 'default' | 'color' | 'gray' | 'bitonal';
  public format: 'jpg' | 'tif' | 'png' | 'gif' | 'jp2' | 'pdf' | 'webp';

  constructor() {
    this.scheme = 'https';
    this.server = '';
    this.prefix = '';
    this.identifier = '';
    this.region = 'full';
    this.size = 'max';
    this.rotation = '0';
    this.quality = 'default';
    this.format = 'jpg';
  }

  /**
   * Parse the specified IIIF URI.
   *
   * @param uri The URI to parse.
   * @returns A new IIIF URI object.
   */
  public static parse(uri?: string | null): IiifUri | null {
    if (!uri) {
      return null;
    }
    const parts = uri.replace(/^https?:\/\//, '').split('/');
    if (parts.length < 6) {
      return null;
    }

    // TODO: finer regex for \/([^\/]+)
    //  scheme       etc identifierregion    size      rotation                quality                        format
    const m =
      /^(https?):\/\/(.+)\/([^\/]+)\/([^\/]+)\/([^\/]+)\/!?([0-9]+(?:\.[0-9]+)?)\/(default|color|gray|bitonal)\.(jpg|tif|png|gif|jp2|pdf|webp)$/.exec(
        uri
      );
    const result = new IiifUri();
    if (!m) {
      return null;
    }

    // m[1]=scheme
    result.scheme = m[1] as any;

    // m[2] must be split into server and prefix
    let i = m[2].indexOf('/');
    if (i > -1) {
      result.server = m[2].substring(0, i);
      result.prefix = m[2].substring(i + 1);
    } else {
      result.server = m[2];
    }

    // m[3] identifier
    result.identifier = m[3];
    // m[4] region
    result.region = m[4];
    // m[5] size
    result.size = m[5];
    // m[6] rotation
    result.rotation = m[6];
    // m[7] quality
    result.quality = m[7] as any;
    // m[8] format
    result.format = m[8] as any;

    return result;
  }

  /**
   * Render this URI into a string.
   *
   * @param info True to render the URI for the image info, false to render
   * the image URI.
   * @returns URI string.
   */
  public toString(info = false): string {
    const sb: string[] = [];

    // scheme://
    sb.push(this.scheme);
    sb.push('://');

    // server/prefix
    sb.push(encodeURIComponent(this.server));
    if (this.prefix) {
      sb.push('/');
      sb.push(encodeURIComponent(this.prefix));
    }

    // /identifier
    sb.push('/');
    sb.push(encodeURIComponent(this.identifier));

    if (info) {
      sb.push('/');
      sb.push('info.json');
      return sb.join('');
    }

    // region/size/rotation/quality
    sb.push(
      [this.region, this.size, this.rotation, this.quality]
        .map((s) => encodeURIComponent(s))
        .join('/')
    );

    // .format
    sb.push('.');
    sb.push(this.format);

    return sb.join('');
  }
}
