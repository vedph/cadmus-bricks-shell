import { Component } from '@angular/core';

import {
  BarCustomAction,
  BarCustomActionRequest,
} from 'projects/myrmidon/cadmus-ui-custom-action-bar/src/public-api';

@Component({
  selector: 'app-custom-action-bar-pg',
  templateUrl: './custom-action-bar-pg.component.html',
  styleUrls: ['./custom-action-bar-pg.component.css'],
})
export class CustomActionBarPgComponent {
  public actions: BarCustomAction[];
  public request?: BarCustomActionRequest;

  constructor() {
    this.actions = [
      {
        id: 'add',
        iconId: 'add_circle',
        tip: 'Add',
      },
      {
        id: 'del',
        iconId: 'delete',
        style: { color: 'red' },
        tip: 'Delete',
      },
    ];
  }

  public onActionRequest(action: BarCustomActionRequest) {
    this.request = action;
  }
}
