import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  ViafRefLookupService,
  ViafSearchResult,
  ViafService,
  ViafSuggestResult,
} from 'projects/myrmidon/cadmus-refs-viaf-lookup/src/public-api';

@Component({
  selector: 'app-viaf-ref-lookup-pg',
  templateUrl: './viaf-ref-lookup-pg.component.html',
  styleUrls: ['./viaf-ref-lookup-pg.component.css'],
})
export class ViafRefLookupPgComponent {
  public item?: ViafSearchResult;
  public term: FormControl<string | null>;
  public form: FormGroup;
  public suggestResult: ViafSuggestResult | undefined;
  public suggesting?: boolean;

  constructor(
    formBuilder: FormBuilder,
    public service: ViafRefLookupService,
    private _viaf: ViafService
  ) {
    this.term = formBuilder.control(null, Validators.required);
    this.form = formBuilder.group({
      term: this.term,
    });
  }

  public onItemChange(item: any | undefined): void {
    this.item = item;
  }

  public onMoreRequest(): void {
    alert('More...');
  }

  public suggestTerm(): void {
    if (this.form.invalid || !this.term.value || this.suggesting) {
      return;
    }
    this.suggesting = true;
    this._viaf.suggest(this.term.value).subscribe({
      next: (r) => {
        this.suggestResult = r;
        this.suggesting = false;
      },
      error: (error) => {
        console.error('Error!');
        if (error) {
          console.log(JSON.stringify(error));
        }
        this.suggesting = false;
      },
    });
  }
}
