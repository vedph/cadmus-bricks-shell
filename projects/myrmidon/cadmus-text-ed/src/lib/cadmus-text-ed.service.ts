import { Inject, Injectable, Optional } from '@angular/core';

/**
 * Selector special value for match-first in CadmusTextEdQuery.
 */
export const CADMUS_TEXT_ED_QUERY_MATCH_FIRST = '$match-first';
/**
 * Selector special value for match-all in CadmusTextEdQuery.
 */
export const CADMUS_TEXT_ED_QUERY_MATCH_ALL = '$match-all';

/**
 * A query to edit text using the Cadmus text editor service.
 */
export interface CadmusTextEdQuery {
  selector?: string;
  text: string;
  context?: any;
}

/**
 * The result of a text edit operation using a plugin.
 */
export interface CadmusTextEdPluginResult {
  query: CadmusTextEdQuery;
  text: string;
  id: string;
  payload?: any;
  error?: string;
}

/**
 * The result of a text edit operation, as returned by
 * one or more plugins.
 */
export interface CadmusTextEdResult {
  /**
   * The original query.
   */
  query: CadmusTextEdQuery;
  /**
   * The edited text.
   */
  text: string;
  /**
   * The IDs of all the plugins that have been applied to the text.
   */
  ids?: string[];
  /**
   * The payloads returned by all the plugins that have been applied
   * to the text. This array has the same size of ids, so that those
   * plugins which do not return a payload will have an undefined entry
   * here.
   */
  payloads?: any[];
  /**
   * An error message, if any. As soon as an error occurs, the editing
   * process stops and this error is set.
   */
  error?: string;
}

/**
 * A plugin used by the Cadmus text editor service.
 */
export interface CadmusTextEdPlugin {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly version: string;
  enabled: boolean;

  /**
   * True if this plugin matches the specified query.
   * @param query The query to match.
   */
  matches(query: CadmusTextEdQuery): boolean;

  /**
   * Edit the text using this plugin.
   * @param query The text edit query.
   * @returns The edit result.
   */
  edit: (query: CadmusTextEdQuery) => Promise<CadmusTextEdPluginResult>;
}

/**
 * Cadmus text editor service options.
 */
export interface CadmusTextEdServiceOptions {
  plugins: CadmusTextEdPlugin[];
}

/**
 * Injection token for the Cadmus text editor service options.
 */
export const CADMUS_TEXT_ED_SERVICE_OPTIONS_TOKEN =
  'CadmusTextEdServiceOptions';

/**
 * Create a new instance of the Cadmus text editor service.
 * In your consumer component's providers array, you can provide this service
 * using the following code:
 * ```ts
 * providers: [
 *   {
 *     provide: CadmusTextEdService,
 *     useFactory: cadmusTextEdFactory,
 *     deps: [ /* your instance of CadmusTextEdServiceOptions * /]
 *   }
 * ]
 * ```
 *
 * @param options The options for the service.
 * @returns New service instance.
 */
export function cadmusTextEdFactory(
  options: CadmusTextEdServiceOptions
): CadmusTextEdService {
  return new CadmusTextEdService(options);
}

/**
 * Cadmus text editor service. This is a simple service that allows you to
 * edit text using a set of plugins. Each plugin is a function that takes
 * a text and an optional context object, and returns the edited text.
 * For instance, there are stock plugins for toggling bold or italic in
 * Markdown text. The service can be used in inline text editing, typically
 * in Monaco-based editors with Markdown content.
 *
 * To configure the default plugins, you can provide an instance of
 * `CadmusTextEdServiceOptions` using the injection token
 * `CADMUS_TEXT_ED_SERVICE_OPTIONS_TOKEN`, e.g.:
 * ```ts
 * {
 *   provide: CADMUS_TEXT_ED_SERVICE_OPTIONS_TOKEN,
 *   useValue: { plugins: [...] },
 * }
 * Alternatively, you can use the `configure` method to set the options.
 **/
@Injectable()
export class CadmusTextEdService {
  constructor(
    @Optional()
    @Inject(CADMUS_TEXT_ED_SERVICE_OPTIONS_TOKEN)
    private _options?: CadmusTextEdServiceOptions
  ) {}

  /**
   * Configure the service.
   * @param options The options.
   */
  public configure(options: CadmusTextEdServiceOptions): void {
    this._options = options;
  }

  /**
   * Get the list of plugins.
   */
  public getPlugins(): CadmusTextEdPlugin[] {
    if (!this._options || !this._options.plugins) {
      return [];
    }
    return [...this._options.plugins];
  }

  /**
   * Edit the input text using the plugin with the specified ID.
   * If the plugin is not found, the input text is returned as is.
   * @param query The query.
   * @returns The result.
   */
  public async edit(query: CadmusTextEdQuery): Promise<CadmusTextEdResult> {
    // resolve immediately if no plugins
    if (!this._options?.plugins?.length) {
      return {
        text: query.text,
        query,
      };
    }

    let plugin: CadmusTextEdPlugin | undefined;

    // find the first applicable plugin
    switch (query.selector) {
      case CADMUS_TEXT_ED_QUERY_MATCH_FIRST:
      case CADMUS_TEXT_ED_QUERY_MATCH_ALL:
        plugin = this.getPlugins().find((p) => p.matches(query));
        break;
      default:
        plugin = this._options!.plugins.find((p) => p.id === query.selector);
        break;
    }

    // return unchanged text if none found
    if (!plugin?.enabled) {
      return {
        text: query.text,
        query,
      };
    }

    // get the first result
    let r = await plugin.edit(query);
    const result: CadmusTextEdResult = {
      ids: [plugin.id],
      text: r.text,
      query,
      payloads: [r.payload],
      error: r.error,
    };

    if (query.selector !== CADMUS_TEXT_ED_QUERY_MATCH_ALL || result.error) {
      return result;
    }

    // keep editing with the next plugin until all matches are done
    let nextQuery: CadmusTextEdQuery = {
      ...query,
      selector: 'match-first',
      text: r.text,
    };

    for (
      let i = this._options.plugins.indexOf(plugin) + 1;
      i < this._options.plugins.length;
      i++
    ) {
      const nextPlugin = this._options.plugins[i];

      // skip disabled or non-matching plugins
      if (!nextPlugin.enabled || !nextPlugin.matches(nextQuery)) {
        continue;
      }

      // edit with next plugin
      r = await nextPlugin.edit(nextQuery);

      // update accumulated result
      result.text = r.text;
      result.ids!.push(nextPlugin.id);
      result.payloads?.push(r.payload);
      if (r.error) {
        result.error = r.error;
        return result;
      }

      // prepare next query
      nextQuery.text = result.text;
    }

    return result;
  }
}
