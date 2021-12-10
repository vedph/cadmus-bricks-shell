import { Component, OnInit } from '@angular/core';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { ProperName } from 'projects/myrmidon/cadmus-refs-proper-name/src/public-api';

@Component({
  selector: 'app-proper-name-pg',
  templateUrl: './proper-name-pg.component.html',
  styleUrls: ['./proper-name-pg.component.css'],
})
export class ProperNamePgComponent implements OnInit {
  public name: ProperName | undefined;
  public langEntries: ThesaurusEntry[] | undefined;
  public namePieceTypeEntries: ThesaurusEntry[] | undefined;

  constructor() {}

  ngOnInit(): void {
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
    this.namePieceTypeEntries = [
      { id: 'first', value: 'first' },
      { id: 'last', value: 'last' },
      { id: 'name', value: 'name' },
      { id: 'title', value: 'title' },
      { id: 'praenomen', value: 'praenomen' },
      { id: 'nomen', value: 'nomen' },
      { id: 'cognomen', value: 'cognomen' },
    ];

    this.name = {
      language: 'lat',
      tag: 'free',
      pieces: [
        { type: 'praenomen', value: 'Publius' },
        { type: 'nomen', value: 'Vergilius' },
        { type: 'cognomen', value: 'Maro' },
      ],
    };
  }

  public onNameChange(model: ProperName): void {
    this.name = model;
  }
}