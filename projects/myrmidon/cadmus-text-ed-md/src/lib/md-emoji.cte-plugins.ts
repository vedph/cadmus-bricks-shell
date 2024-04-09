import {
  CadmusTextEdPlugin,
  CadmusTextEdQuery,
  CadmusTextEdPluginResult,
} from '@myrmidon/cadmus-text-ed';

/**
 * Markdown emoji inserter plugin.
 * See https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md.
 * List from https://api.github.com/emojis.
 */
export class MdEmojiCtePlugin implements CadmusTextEdPlugin {
  public readonly id = 'md.emoji';
  public readonly name = 'Markdown Emoji IME';
  public readonly description = 'Insert Emoji Markdown code from its name.';
  public readonly version = '1.0.0';
  public enabled = true;

  public matches(query: CadmusTextEdQuery): boolean {
    return query.selector !== 'id' || query.text === this.id;
  }

  public edit(query: CadmusTextEdQuery): Promise<CadmusTextEdPluginResult> {
    return new Promise<CadmusTextEdPluginResult>((resolve, reject) => {
      // TODO
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
