import { Injectable } from '@angular/core';
import {
  CadmusTextEdPlugin,
  CadmusTextEdQuery,
  CadmusTextEdPluginResult,
} from '@myrmidon/cadmus-text-ed';

import { EmojiService } from './emoji.service';

/**
 * Markdown emoji inserter plugin.
 * See https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md.
 * List from https://api.github.com/emojis.
 */
@Injectable()
export class MdEmojiCtePlugin implements CadmusTextEdPlugin {
  public readonly id = 'md.emoji';
  public readonly name = 'Markdown Emoji IME';
  public readonly description = 'Insert Emoji Markdown code from its name.';
  public readonly version = '1.0.0';
  public enabled = true;

  constructor(private _emojiService: EmojiService) {}

  public matches(query: CadmusTextEdQuery): boolean {
    return query.selector !== 'id' || query.text === this.id;
  }

  public edit(query: CadmusTextEdQuery): Promise<CadmusTextEdPluginResult> {
    return new Promise<CadmusTextEdPluginResult>((resolve, reject) => {
      // if text is equal to an emoji name, insert it
      const emoji = this._emojiService.getEmoji(query.text);
      if (emoji) {
        const result: CadmusTextEdPluginResult = {
          id: this.id,
          text: this._emojiService.getEmojiText(emoji),
          query,
        };
        resolve(result);
        return;
      }

      // TODO open lookup dialog
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
