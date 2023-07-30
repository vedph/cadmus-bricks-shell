import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  MessageService,
  RefLookupConfig,
} from 'projects/myrmidon/cadmus-refs-lookup/src/public-api';
import { ViafRefLookupService } from '@myrmidon/cadmus-refs-viaf-lookup';

import { WebColorLookup } from '../ref-lookup-pg/ref-lookup-pg.component';

@Component({
  selector: 'app-ref-lookup-set-pg',
  templateUrl: './ref-lookup-set-pg.component.html',
  styleUrls: ['./ref-lookup-set-pg.component.css'],
})
export class RefLookupSetPgComponent implements OnDestroy {
  private _sub?: Subscription;
  public item?: any;
  public configs: RefLookupConfig[];

  constructor(
    messenger: MessageService,
    viafService: ViafRefLookupService
  ) {
    this.configs = [
      {
        name: 'colors',
        iconUrl: '/assets/img/colors128.png',
        description: 'Colors',
        label: 'color',
        service: new WebColorLookup(),
      },
      {
        name: 'VIAF',
        iconUrl: '/assets/img/viaf128.png',
        description: 'Virtual International Authority File',
        label: 'ID',
        service: viafService,
      },
    ];
    this._sub = messenger.select().pipe().subscribe((m) => {
      console.log(JSON.stringify(m));
    });
  }

  public ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  public onItemChange(item: any): void {
    this.item = item;
  }

  public onMoreRequest(item: any): void {
    console.log('MORE REQUEST');
  }
}
