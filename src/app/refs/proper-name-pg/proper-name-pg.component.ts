import { Component, OnInit } from '@angular/core';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import { AssertedProperName } from 'projects/myrmidon/cadmus-refs-proper-name/src/public-api';

@Component({
  selector: 'app-proper-name-pg',
  templateUrl: './proper-name-pg.component.html',
  styleUrls: ['./proper-name-pg.component.css'],
})
export class ProperNamePgComponent implements OnInit {
  public initialName?: AssertedProperName;
  public name: AssertedProperName | undefined;
  public langEntries: ThesaurusEntry[] | undefined;
  public namePieceTypeEntries: ThesaurusEntry[] | undefined;

  constructor() {
    this.langEntries = [
      { id: 'ita', value: 'Italian' },
      { id: 'eng', value: 'English' },
      { id: 'fra', value: 'French' },
      { id: 'spa', value: 'Spanish' },
      { id: 'ger', value: 'German' },
      { id: 'lat', value: 'Latin' },
      { id: 'grc', value: 'Greek' },
      { id: 'gre', value: 'Modern Greek' },
    ];
    this.configureAsAnthroponym();
  }

  ngOnInit(): void {}

  public configureAsAnthroponym(): void {
    this.namePieceTypeEntries = [
      { id: 'first', value: 'first' },
      { id: 'last', value: 'last' },
      { id: 'name', value: 'name' },
      { id: 'title', value: 'title' },
      { id: 'praenomen', value: 'praenomen' },
      { id: 'nomen', value: 'nomen' },
      { id: 'cognomen', value: 'cognomen' },
    ];

    this.initialName = {
      language: 'lat',
      tag: 'free',
      pieces: [
        { type: 'praenomen', value: 'Publius' },
        { type: 'nomen', value: 'Vergilius' },
        { type: 'cognomen', value: 'Maro' },
      ],
    };
  }

  public configureAsToponym(): void {
    this.namePieceTypeEntries = [
      { id: 'continent*', value: 'continent' },
      { id: 'continent.europe', value: 'Europe' },
      { id: 'continent.n-america', value: 'North America' },
      { id: 'continent.s-america', value: 'South America' },
      { id: 'continent.africa', value: 'Africa' },
      { id: 'continent.asia', value: 'Asia' },
      { id: 'continent.australia', value: 'Australia' },
      { id: 'continent.antarctica', value: 'Antarctica' },
      { id: 'country*', value: 'country' },
      { id: 'site*', value: 'site' },
      { id: '_order', value: 'continent country site' },
    ];

    this.initialName = {
      language: 'eng',
      tag: 'sample',
      pieces: [
        { type: 'continent', value: 'continent.europe' },
        { type: 'country', value: 'Italy' },
        { type: 'region', value: 'Tuscany' },
      ],
    };
  }

  public onNameChange(model: AssertedProperName | undefined): void {
    this.name = model;
  }
}
