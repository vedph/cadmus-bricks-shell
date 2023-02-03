import { Component, OnInit } from '@angular/core';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { AssertedId } from '@myrmidon/cadmus-refs-asserted-id';

@Component({
  selector: 'app-asserted-ids-pg',
  templateUrl: './asserted-ids-pg.component.html',
  styleUrls: ['./asserted-ids-pg.component.css'],
})
export class AssertedIdsPgComponent implements OnInit {
  public ids?: AssertedId[];
  public idScopeEntries: ThesaurusEntry[];
  public idTagEntries: ThesaurusEntry[];
  public assTagEntries: ThesaurusEntry[];
  public refTypeEntries: ThesaurusEntry[];
  public refTagEntries: ThesaurusEntry[];

  constructor() {
    this.idScopeEntries = [
      {
        id: 'scope1',
        value: 'id-scope-1'
      },
      {
        id: 'scope2',
        value: 'id-scope-2'
      },
      {
        id: '-',
        value: '---'
      },
    ];
    this.idTagEntries = [
      {
        id: 'idt1',
        value: 'id-tag-1'
      },
      {
        id: 'idt2',
        value: 'id-tag-2'
      },
      {
        id: '-',
        value: '---'
      },
    ];
    this.assTagEntries = [
      {
        id: 'ast1',
        value: 'ass-tag-1'
      },
      {
        id: 'ast2',
        value: 'ass-tag-2'
      },
      {
        id: '-',
        value: '---'
      },
    ];
    this.refTypeEntries = [
      {
        id: 'book',
        value: 'book'
      },
      {
        id: 'ms',
        value: 'manuscript'
      },
    ];
    this.refTagEntries = [
      {
        id: 'a',
        value: 'alpha'
      },
      {
        id: 'b',
        value: 'beta'
      },
      {
        id: '-',
        value: '---'
      },
    ];

    this.ids = [
      {
        value: 'http://some-resources/stuff/alpha',
        scope: '-'
      },
    ];
  }

  ngOnInit(): void {}

  public onIdsChange(ids: AssertedId[]): void {
    this.ids = ids;
  }
}
