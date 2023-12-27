import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { ErrorService } from '@myrmidon/ng-tools';

// http://viaf.org/ : suggest UI
// http://viaf.org/viaf/search/viaf : search UI
// https://www.oclc.org/developer/develop/web-services/viaf/authority-cluster.en.html : syntax details

export interface ViafSuggestEntry {
  term: string;
  displayForm: string;
  nametype: string;
  recordID: string;
  viafid: string;
  score: number;
}

export interface ViafSuggestResult {
  query: string;
  result: ViafSuggestEntry[];
}

export interface ViafRecord {
  recordSchema: string;
  recordData: any;
}

export interface ViafSearchRecord {
  record: ViafRecord;
}

export interface ViafSearchResult {
  numberOfRecords: number;
  records?: ViafSearchRecord[];
}

export const VIAF_AUTHORITIES = [
  { id: 'all', label: 'All source data within VIAF' },
  { id: 'bav', label: 'Biblioteca Apostolica Vaticana' },
  { id: 'bibsys', label: 'BIBSYS' },
  { id: 'blbnb', label: 'National Library of Brazil' },
  { id: 'bnc', label: 'National Library of Catalonia' },
  { id: 'bnchl', label: 'National Library of Chile' },
  { id: 'bne', label: 'Biblioteca Nacional de España' },
  { id: 'bnf', label: 'Bibliothèque Nationale de France' },
  { id: 'bnl', label: 'National Library of Luxembourg' },
  { id: 'b2q', label: 'National Library and Archives of Quèbec' },
  { id: 'cyt', label: 'National Central Library, Taiwan' },
  { id: 'dbc', label: 'DBC (Danish Bibliographic Center)' },
  { id: 'dnb', label: 'Deutsche Nationalbibliothek' },
  { id: 'egaxa', label: 'Bibliotheca Alexandrina (Egypt)' },
  { id: 'errr', label: 'National Library of Estonia' },
  { id: 'iccu', label: 'Istituto Centrale per il Catalogo Unico' },
  { id: 'isni', label: 'ISNI' },
  { id: 'jpg', label: 'Getty Research Institute' },
  { id: 'krnlk', label: 'National Library of Korea' },
  { id: 'lc', label: 'Library of Congress/NACO' },
  { id: 'lac', label: 'Library and Archives Canada' },
  { id: 'lnb', label: 'National Library of Latvia' },
  { id: 'lnl', label: 'Lebanese National Library' },
  { id: 'mrbnr', label: 'National Library of Morocco' },
  { id: 'ndl', label: 'National Diet Library, Japan' },
  { id: 'nii', label: 'National Institute of Informatics (Japan)' },
  { id: 'nkc', label: 'National Library of the Czech Republic' },
  { id: 'nla', label: 'National Library of Australia' },
  { id: 'nlb', label: 'National Library Board, Singapore' },
  { id: 'nli', label: 'National Library of Israel' },
  { id: 'nliara', label: 'National Library of Israel (Arabic)' },
  { id: 'nlicyr', label: 'National Library of Israel (Cyrillic)' },
  { id: 'nliheb', label: 'National Library of Israel (Hebrew)' },
  { id: 'nlilat', label: 'National Library of Israel (Latin)' },
  { id: 'nlp', label: 'National Library of Poland' },
  { id: 'nlr', label: 'National Library of Russia' },
  { id: 'nsk', label: 'National and University Library in Zagreb' },
  { id: 'nszl', label: 'National Szèchènyi Library, Hungary' },
  { id: 'nta', label: 'National Library of the Netherlands' },
  { id: 'nukat', label: 'NUKAT Center of Warsaw University Library' },
  { id: 'n6i', label: 'National Library of Ireland' },
  { id: 'perseus', label: 'PERSEUS' },
  { id: 'ptbnp', label: 'Biblioteca Nacional de Portugal' },
  { id: 'rero', label: 'RERO.Library Network of Western Switzerland' },
  { id: 'selibr', label: 'National Library of Sweden' },
  { id: 'srp', label: 'Syriac Reference Portal' },
  { id: 'sudoc', label: 'Sudoc [ABES], France' },
  { id: 'swnl', label: 'Swiss National Library' },
  { id: 'uiy', label: 'National and University Library of Iceland (NULI)' },
  { id: 'vlacc', label: 'Flemish Public Libraries' },
  { id: 'wkp', label: 'Wikidata' },
  { id: 'w2z', label: 'National Library of Norway' },
  { id: 'xa', label: 'xA (eXtended Authorities)' },
  { id: 'xr', label: 'xR (eXtended Relationships)' },
  { id: 'fast', label: 'FAST' },
];

export const VIAF_TERMS = [
  '=',
  'exact',
  'any',
  'all',
  '<',
  '>',
  '<=',
  '>=',
  'not',
];

export enum ViafField {
  // 'cql.resultSetId',
  // 'cql.serverChoice',
  // 'local.source',
  // 'local.sources',
  // 'local.viafID',
  // 'oai.datestamp',
  All = 'cql.any',
  Corporate = 'local.corporateNames',
  Geographic = 'local.geographicNames',
  Lccn = 'local.LCCN',
  Length = 'local.length',
  Person = 'local.personalNames',
  Work = 'local.uniformTitleWorks',
  Expression = 'local.uniformTitleExpressions',
  PreferredHeading = 'local.mainHeadingEl',
  ExactHeading = 'local.names',
  BibliographicTitle = 'local.title',
}

export enum ViafIndex {
  All = 'all',
  // TODO
}

const API_BASE = 'https://www.viaf.org/viaf';

/**
 * VIAF API service.
 */
@Injectable({
  providedIn: 'root',
})
export class ViafService {
  // despite what the documentation seems to imply,
  // (https://www.oclc.org/developer/news/2016/upcoming-changes-to-viaf.en.html)
  // there is no CORS support, so we must stick with JSONP

  constructor(private _http: HttpClient, private _error: ErrorService) {}

  public suggest(term: string): Observable<ViafSuggestResult> {
    const url = `${API_BASE}/AutoSuggest?query=${term}`;
    return this._http
      .jsonp<ViafSuggestResult>(url, 'callback')
      .pipe(retry(3), catchError(this._error.handleError));
  }

  public search(
    query: string,
    start = 1,
    max = 10,
    sortKey = 'holdingscount'
  ): Observable<ViafSearchResult> {
    // https://www.oclc.org/developer/develop/web-services/viaf/authority-cluster.en.html
    let params = new HttpParams()
      .set('query', query)
      .set('httpAccept', 'application/json')
      .set('maximumRecords', max.toString());

    // start: startRecord
    if (start > 1) {
      params = params.set('startRecord', start.toString());
    }

    // sortKey ('holdingscount')
    if (sortKey && sortKey !== 'holdingscount') {
      params = params.set('sortKey', sortKey);
    }

    const url = `${API_BASE}/search?` + params.toString();
    return this._http
      .jsonp<ViafSearchResult>(url, 'callback')
      .pipe(retry(3), catchError(this._error.handleError));
  }

  // details
  // http://viaf.org/viaf/102333412/viaf.json
}
