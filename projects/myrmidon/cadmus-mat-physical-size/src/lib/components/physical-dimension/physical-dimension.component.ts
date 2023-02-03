import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { debounceTime } from 'rxjs/operators';

/**
 * A physical dimension value.
 */
export interface PhysicalDimension {
  tag?: string;
  value: number;
  unit: string;
}

@Component({
  selector: 'cadmus-physical-dimension',
  templateUrl: './physical-dimension.component.html',
  styleUrls: ['./physical-dimension.component.css'],
})
export class PhysicalDimensionComponent implements OnInit {
  private _disabled?: boolean;
  private _changeFrozen?: boolean;
  private _dimension?: PhysicalDimension;

  @Input()
  public parentForm?: FormGroup;

  @Input()
  public label?: string;

  // physical-size-units
  @Input()
  public unitEntries?: ThesaurusEntry[];

  // physical-size-tags
  @Input()
  public tagEntries?: ThesaurusEntry[];

  @Input()
  public get dimension(): PhysicalDimension | undefined {
    return this._dimension;
  }
  public set dimension(value: PhysicalDimension | undefined) {
    if (this._dimension !== value) {
      this._dimension = value;
      this.updateForm(value);
    }
  }

  @Input()
  public get disabled(): boolean | undefined {
    return this._disabled;
  }
  public set disabled(value: boolean | undefined) {
    this._disabled = value;
    if (value) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  @Output()
  public dimensionChange: EventEmitter<PhysicalDimension>;

  public value: FormControl<number>;
  public unit: FormControl<string | null>;
  public tag: FormControl<string | null>;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    // events
    this.dimensionChange = new EventEmitter<PhysicalDimension>();
    // form
    this.value = formBuilder.control(0, { nonNullable: true });
    this.unit = formBuilder.control(null, Validators.required);
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.form = formBuilder.group({
      value: this.value,
      unit: this.unit,
      tag: this.tag,
    });
    this.label = 'dimension';

    // default entries
    this.unitEntries = [
      { id: 'cm', value: 'cm' },
      { id: 'mm', value: 'mm' },
    ];
  }

  ngOnInit(): void {
    if (this.parentForm) {
      this.parentForm.addControl(this.label || '', this.form);
    }
    this.updateForm(this.dimension);

    // on change emit event
    this.form.valueChanges.pipe(debounceTime(300)).subscribe((_) => {
      if (!this._changeFrozen) {
        this._dimension = this.getModel();
        this.dimensionChange.emit(this._dimension);
      }
    });
  }

  private updateForm(model?: PhysicalDimension): void {
    this._changeFrozen = true;
    if (!model) {
      this.form.reset();
    } else {
      this.value.setValue(model.value);
      this.unit.setValue(model.unit);
      this.tag.setValue(model.tag || null);
      this.form.markAsPristine();
    }
    this._changeFrozen = false;
  }

  private getModel(): PhysicalDimension {
    return {
      value: this.value.value || 0,
      unit: this.unit.value || '',
      tag: this.tag.value || undefined,
    };
  }
}
