import { Injectable } from '@angular/core';
import {
  CadmusTextEdPlugin,
  CadmusTextEdQuery,
  CadmusTextEdPluginResult,
} from '@myrmidon/cadmus-text-ed';

/**
 * Toggle Markdown bold formatting plugin.
 */
@Injectable()
export class MdBoldCtePlugin implements CadmusTextEdPlugin {
  public readonly id = 'md.bold';
  public readonly name = 'Markdown Bold Toggle';
  public readonly description = 'Toggle bold formatting in Markdown text.';
  public readonly version = '1.0.0';
  public enabled = true;

  public matches(query: CadmusTextEdQuery): boolean {
    return query.selector !== 'id' || query.text === this.id;
  }

  public edit(query: CadmusTextEdQuery): Promise<CadmusTextEdPluginResult> {
    return new Promise<CadmusTextEdPluginResult>((resolve, reject) => {
      const result: CadmusTextEdPluginResult = {
        id: this.id,
        text: /\*\*(.+?)\*\*/g.test(query.text)
          ? query.text.replace(/\*\*(.+?)\*\*/g, '$1')
          : `**${query.text}**`,
        query,
      };
      resolve(result);
    });
  }
}
