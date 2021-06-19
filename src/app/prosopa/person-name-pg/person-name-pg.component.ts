import { Component, OnInit } from '@angular/core';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { PersonName } from 'projects/myrmidon/cadmus-prosopa-person-name/src/public-api';

@Component({
  selector: 'app-person-name-pg',
  templateUrl: './person-name-pg.component.html',
  styleUrls: ['./person-name-pg.component.css'],
})
export class PersonNamePgComponent implements OnInit {
  public initialPersonName: PersonName | undefined;
  public lastPersonName: PersonName | undefined;
  public langEntries: ThesaurusEntry[] | undefined;
  public namePartTypeEntries: ThesaurusEntry[] | undefined;

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
    this.namePartTypeEntries = [
      { id: 'first', value: 'first' },
      { id: 'last', value: 'last' },
      { id: 'name', value: 'name' },
      { id: 'title', value: 'title' },
      { id: 'praenomen', value: 'praenomen' },
      { id: 'nomen', value: 'nomen' },
      { id: 'cognomen', value: 'cognomen' },
    ];

    this.initialPersonName = {
      language: 'lat',
      tag: 'free',
      parts: [
        { type: 'praenomen', value: 'Publius' },
        { type: 'nomen', value: 'Vergilius' },
        { type: 'cognomen', value: 'Maro' },
      ],
    };
  }

  public onPersonNameChange(model: PersonName): void {
    this.lastPersonName = model;
  }
}
