import { Component } from '@angular/core';
import { EnvService, RamStorageService } from '@myrmidon/ng-tools';
import { ASSERTED_COMPOSITE_ID_CONFIGS_KEY } from 'projects/myrmidon/cadmus-refs-asserted-ids/src/public-api';
import { WebColorLookup } from './refs/ref-lookup-pg/ref-lookup-pg.component';
import { ViafService } from 'projects/myrmidon/cadmus-refs-viaf-lookup/src/public-api';
import { RefLookupConfig } from 'projects/myrmidon/cadmus-refs-lookup/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public version: string;

  constructor(env: EnvService, storage: RamStorageService, viaf: ViafService) {
    this.version = env.get('version') || '';
    // configure external lookup for asserted composite IDs
    storage.store(ASSERTED_COMPOSITE_ID_CONFIGS_KEY, [
      {
        name: 'colors',
        iconUrl: '/assets/img/colors128.png',
        description: 'Colors',
        label: 'color',
        service: new WebColorLookup(),
        itemIdGetter: (item: any) => item.value,
        itemLabelGetter: (item: any) => item.name,
      },
      {
        name: 'VIAF',
        iconUrl: '/assets/img/viaf128.png',
        description: 'Virtual International Authority File',
        label: 'ID',
        service: viaf,
        itemIdGetter: (item: any) => item.viafid,
        itemLabelGetter: (item: any) => item.term,
      },
    ] as RefLookupConfig[]);
  }
}
