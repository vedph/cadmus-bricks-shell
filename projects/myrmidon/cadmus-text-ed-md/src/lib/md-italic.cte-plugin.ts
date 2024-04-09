import { Injectable } from '@angular/core';
import {
  CadmusTextEdPlugin,
  CadmusTextEdQuery,
  CadmusTextEdPluginResult,
} from '@myrmidon/cadmus-text-ed';

/**
 * Toggle Markdown italic formatting plugin.
 */
@Injectable()
export class MdItalicCtePlugin implements CadmusTextEdPlugin {
  public readonly id = 'md.italic';
  public readonly name = 'Markdown Italic Toggle';
  public readonly description = 'Toggle italic formatting in Markdown text.';
  public readonly version = '1.0.0';
  public enabled = true;

  public matches(query: CadmusTextEdQuery): boolean {
    return query.selector !== 'id' || query.text === this.id;
  }

  public edit(query: CadmusTextEdQuery): Promise<CadmusTextEdPluginResult> {
    return new Promise<CadmusTextEdPluginResult>((resolve, reject) => {
      const result: CadmusTextEdPluginResult = {
        id: this.id,
        text: /\*(.+?)\*/g.test(query.text)
          ? query.text.replace(/\*(.+?)\*/g, '$1')
          : `*${query.text}*`,
        query,
      };
      resolve(result);
    });
  }
}
