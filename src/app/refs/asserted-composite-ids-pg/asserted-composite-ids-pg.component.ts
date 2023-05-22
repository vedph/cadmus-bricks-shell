import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import { AssertedCompositeId } from 'projects/myrmidon/cadmus-refs-asserted-ids/src/public-api';

@Component({
  selector: 'app-asserted-composite-ids-pg',
  templateUrl: './asserted-composite-ids-pg.component.html',
  styleUrls: ['./asserted-composite-ids-pg.component.css'],
})
export class AssertedCompositeIdsPgComponent implements OnInit {
  // form
  public pinByTypeMode: FormControl<boolean>;
  public canSwitchMode: FormControl<boolean>;
  public canEditTarget: FormControl<boolean>;
  public form: FormGroup;
  // data
  public ids?: AssertedCompositeId[];
  public idScopeEntries: ThesaurusEntry[];
  public idTagEntries: ThesaurusEntry[];
  public assTagEntries: ThesaurusEntry[];
  public refTypeEntries: ThesaurusEntry[];
  public refTagEntries: ThesaurusEntry[];

  constructor(formBuilder: FormBuilder) {
    // form
    this.pinByTypeMode = formBuilder.control(false, { nonNullable: true });
    this.canSwitchMode = formBuilder.control(false, { nonNullable: true });
    this.canEditTarget = formBuilder.control(false, { nonNullable: true });
    this.form = formBuilder.group({
      pinByTypeMode: this.pinByTypeMode,
      canSwitchMode: this.canSwitchMode,
      canEditTarget: this.canEditTarget,
    });
    // data
    this.idScopeEntries = [
      {
        id: 'scope1',
        value: 'id-scope-1',
      },
      {
        id: 'scope2',
        value: 'id-scope-2',
      },
      {
        id: '-',
        value: '---',
      },
    ];
    this.idTagEntries = [
      {
        id: 'idt1',
        value: 'id-tag-1',
      },
      {
        id: 'idt2',
        value: 'id-tag-2',
      },
      {
        id: '-',
        value: '---',
      },
    ];
    this.assTagEntries = [
      {
        id: 'ast1',
        value: 'ass-tag-1',
      },
      {
        id: 'ast2',
        value: 'ass-tag-2',
      },
      {
        id: '-',
        value: '---',
      },
    ];
    this.refTypeEntries = [
      {
        id: 'book',
        value: 'book',
      },
      {
        id: 'ms',
        value: 'manuscript',
      },
    ];
    this.refTagEntries = [
      {
        id: 'a',
        value: 'alpha',
      },
      {
        id: 'b',
        value: 'beta',
      },
      {
        id: '-',
        value: '---',
      },
    ];

    this.ids = [
      {
        target: {
          gid: 'http://some-resources/stuff/alpha',
          label: 'alpha',
        },
        scope: '-',
      },
      {
        target: {
          gid: 'http://some-resources/stuff/beta',
          label: 'beta',
        },
        scope: '-',
      },
    ];
  }

  ngOnInit(): void {}

  public onIdsChange(ids: AssertedCompositeId[]): void {
    this.ids = ids;
  }
}
