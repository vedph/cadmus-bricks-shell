import { Component, OnInit } from '@angular/core';
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
} from '@myrmidon/cadmus-refs-viaf-lookup';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-viaf-ref-lookup-pg',
  templateUrl: './viaf-ref-lookup-pg.component.html',
  styleUrls: ['./viaf-ref-lookup-pg.component.css'],
})
export class ViafRefLookupPgComponent implements OnInit {
  public item?: ViafSearchResult;
  public term: FormControl;
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

  ngOnInit(): void {}

  public onItemChange(item: any | undefined): void {
    this.item = item;
  }

  public onMoreRequest(): void {
    alert('More...');
  }

  public suggestTerm(): void {
    if (this.form.invalid || this.suggesting) {
      return;
    }
    this.suggesting = true;
    this._viaf
      .suggest(this.term.value)
      .pipe(take(1))
      .subscribe((r) => {
        this.suggestResult = r;
        this.suggesting = false;
      }, error => {
        console.error('Error!');
        if (error) {
          console.log(JSON.stringify(error));
        }
        this.suggesting = false;
      });
  }
}
