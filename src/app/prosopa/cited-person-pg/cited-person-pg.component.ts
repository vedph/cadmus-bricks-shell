import { Component, OnInit } from '@angular/core';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { CitedPerson } from 'projects/myrmidon/cadmus-prosopa-cited-person/src/public-api';

@Component({
  selector: 'app-cited-person-pg',
  templateUrl: './cited-person-pg.component.html',
  styleUrls: ['./cited-person-pg.component.css'],
})
export class CitedPersonPgComponent implements OnInit {
  public langEntries: ThesaurusEntry[] | undefined;
  public namePartTypeEntries: ThesaurusEntry[] | undefined;
  public initialCitedPerson: CitedPerson;
  public citedPerson: CitedPerson | undefined;

  constructor() {
    this.initialCitedPerson = {
      name: {
        language: 'lat',
        tag: 'free',
        parts: [
          { type: 'praenomen', value: 'Publius' },
          { type: 'nomen', value: 'Vergilius' },
          { type: 'cognomen', value: 'Maro' },
        ],
      },
      rank: 1,
      ids: [
        {
          id: 'i1',
          rank: 1,
          tag: 'tag',
          sources: [
            {
              tag: 'tag',
              author: 'Chantraine',
              work: 'EtGr',
              location: '1.23',
              note: "wow, that's a note!",
            },
          ],
        },
      ],
      sources: [
        {
          tag: 'tag',
          author: 'Allen',
          work: 'Wk',
          location: '245',
        },
      ],
    };
  }

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
  }

  public onCitedPersonChange(model: CitedPerson): void {
    this.citedPerson = model;
  }
}
