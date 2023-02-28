import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import { GalleryListRepository } from '../../gallery-list.repository';
import { GalleryFilter } from '../../models';

interface FilterData {
  filter: GalleryFilter;
  entries: ThesaurusEntry[];
}

interface FilterMetadatum {
  id: string;
  label: string;
  value?: string;
}

@Component({
  selector: 'cadmus-gallery-filter',
  templateUrl: './gallery-filter.component.html',
  styleUrls: ['./gallery-filter.component.css'],
})
export class GalleryFilterComponent implements OnInit {
  private _data$: BehaviorSubject<FilterData>;

  public loading$: Observable<boolean>;

  /**
   * The entries used to represent image gallery metadata filters.
   * Each entry is a metadatum, with ID=metadatum name and value=label.
   * If not set, users will be allowed to freely type a name rather
   * than picking it from a list.
   */
  @Input()
  public get entries(): ThesaurusEntry[] | undefined {
    return this._data$.value.entries;
  }
  public set entries(value: ThesaurusEntry[] | undefined) {
    if (this._data$.value.entries === value) {
      return;
    }
    this._data$.next({ ...this._data$.value, entries: value || [] });
  }

  public metadata: FormControl<FilterMetadatum[]>;
  public form: FormGroup;

  public metaId: FormControl<string>;
  public metaValue: FormControl<string>;
  public metaForm: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private _repository: GalleryListRepository
  ) {
    this._data$ = new BehaviorSubject<FilterData>({ filter: {}, entries: [] });
    this.loading$ = _repository.loading$;
    // forms
    this.metadata = formBuilder.control([], { nonNullable: true });
    this.form = formBuilder.group({
      metadata: this.metadata,
    });

    this.metaId = formBuilder.control('', {
      validators: [Validators.required, Validators.maxLength(500)],
      nonNullable: true,
    });
    this.metaValue = formBuilder.control('', {
      validators: Validators.maxLength(500),
      nonNullable: true,
    });
    this.metaForm = formBuilder.group({
      id: this.metaId,
      value: this.metaValue,
    });
  }

  ngOnInit(): void {
    // update data when filter changes
    this._repository.filter$.subscribe((f) => {
      this._data$.next({ ...this._data$.value, filter: f });
    });
    // update form when data changes
    this._data$.subscribe((d) => {
      this.updateForm(d);
    });
  }

  private updateForm(data: FilterData): void {
    const metadata: FilterMetadatum[] = [];

    Object.keys(data.filter).forEach((key) => {
      const entry = data.entries.find((e) => e.id === key);
      metadata.push({
        id: key,
        label: entry?.value || key,
        value: data.filter[key],
      });
    });
    this.metadata.setValue(metadata);
    this.form.markAsPristine();
  }

  public addMetadatum(): void {
    if (this.metaForm.invalid) {
      return;
    }
    const metadata: FilterMetadatum[] = [...this.metadata.value];
    metadata.push({
      id: this.metaId.value,
      label:
        this._data$.value.entries.find((e) => e.id === this.metaId.value)
          ?.value || this.metaId.value,
      value: this.metaValue.value || '',
    });
    this.metadata.setValue(metadata);
    this.metadata.updateValueAndValidity();
    this.metadata.markAsDirty();
  }

  public deleteMetadatum(index: number): void {
    const metadata: FilterMetadatum[] = [...this.metadata.value];
    metadata.splice(index, 1);
    this.metadata.setValue(metadata);
    this.metadata.updateValueAndValidity();
    this.metadata.markAsDirty();
  }

  private getFilter(): GalleryFilter {
    const filter: GalleryFilter = {};
    const metadata = this.metadata.value;
    for (let i = 0; i < this.metadata.value.length; i++) {
      filter[metadata[i].id] = metadata[i].value || '';
    }
    return filter;
  }

  public reset(): void {
    this.form.reset();
    this.apply();
  }

  public apply(): void {
    if (this.form.invalid) {
      return;
    }
    const filter = this.getFilter();
    this._repository.setFilter(filter);
  }
}
