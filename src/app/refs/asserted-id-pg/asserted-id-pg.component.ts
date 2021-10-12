import { Component, OnInit } from '@angular/core';
import { AssertedId } from 'projects/myrmidon/cadmus-refs-asserted-id/src/public-api';

@Component({
  selector: 'app-asserted-id-pg',
  templateUrl: './asserted-id-pg.component.html',
  styleUrls: ['./asserted-id-pg.component.css'],
})
export class AssertedIdPgComponent implements OnInit {
  public initialId?: AssertedId;
  public id?: AssertedId;

  constructor() {}

  ngOnInit(): void {}

  public onIdChange(id: AssertedId | undefined): void {
    this.id = id;
  }
}
