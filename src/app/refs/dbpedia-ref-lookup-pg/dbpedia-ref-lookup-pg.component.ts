import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

import { CadmusRefsLookupModule } from '@myrmidon/cadmus-refs-lookup';

import { DbpediaDoc, DbpediaRefLookupService } from 'projects/myrmidon/cadmus-refs-dbpedia-lookup/src/public-api';

@Component({
  selector: 'app-dbpedia-ref-lookup-pg',
  standalone: true,
  imports: [CommonModule, MatCardModule, CadmusRefsLookupModule],
  templateUrl: './dbpedia-ref-lookup-pg.component.html',
  styleUrl: './dbpedia-ref-lookup-pg.component.css',
})
export class DbpediaRefLookupPgComponent {
  public docs?: DbpediaDoc[];

  constructor(public service: DbpediaRefLookupService) {}

  public onItemChange(item: any): void {
    this.docs = item;
  }
}
