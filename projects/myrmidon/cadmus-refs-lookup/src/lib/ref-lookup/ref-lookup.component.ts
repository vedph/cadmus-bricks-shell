import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

export interface LookupService{
  lookup<T>(filter: any): Observable<T>;
}

@Component({
  selector: 'cadmus-ref-lookup',
  templateUrl: './ref-lookup.component.html',
  styleUrls: ['./ref-lookup.component.css'],
})
export class RefLookupComponent implements OnInit {
  private _id: string | undefined;
  private _lookup: LookupService | undefined;

  public get lookup(): LookupService | undefined {
    return this._lookup;
  }
  public set lookup(value: LookupService | undefined) {
    this._lookup = value;
  }

  @Input()
  public get id(): string | undefined {
    return this._id;
  }
  public set id(value: string | undefined) {
    this._id = value;
  }

  @Input()
  public hasMore: boolean | undefined;

  @Output()
  public moreRequest: EventEmitter<string>;

  constructor() {
    this.moreRequest = new EventEmitter<string>();
  }

  ngOnInit(): void {}
}
