import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { PhysicalDimension } from '../physical-dimension/physical-dimension.component';

/**
 * A physical 1D, 2D or 3D size.
 */
export interface PhysicalSize {
  tag?: string;
  w?: PhysicalDimension;
  h?: PhysicalDimension;
  d?: PhysicalDimension;
  note?: string;
}

@Component({
  selector: 'cadmus-mat-physical-size',
  templateUrl: './physical-size.component.html',
  styleUrls: ['./physical-size.component.css'],
})
export class PhysicalSizeComponent implements OnInit {
  private _size: PhysicalSize | undefined | null;
  private _defaultWUnit?: string;
  private _defaultHUnit?: string;
  private _defaultDUnit?: string;

  @Input()
  public parentForm?: FormGroup;

  @Input()
  public get size(): PhysicalSize | undefined | null {
    return this._size;
  }
  public set size(value: PhysicalSize | undefined | null) {
    if (this._size !== value) {
      this._size = value;
      this.updateForm(value);
    }
  }

  @Input()
  public get defaultWUnit(): string | undefined | null {
    return this._defaultWUnit;
  };
  public set defaultWUnit(value: string | undefined | null) {
    if (this._defaultWUnit !== value) {
      this._defaultWUnit = value || undefined;
      if (!this.wValue.value) {
        this.wUnit.setValue(value || 'cm');
      }
    }
  }

  @Input()
  public get defaultHUnit(): string | undefined | null {
    return this._defaultHUnit;
  };
  public set defaultHUnit(value: string | undefined | null) {
    if (this._defaultHUnit !== value) {
      this._defaultHUnit = value || undefined;
      if (!this.hValue.value) {
        this.hUnit.setValue(value || 'cm');
      }
    }
  }

  @Input()
  public get defaultDUnit(): string | undefined | null {
    return this._defaultDUnit;
  };
  public set defaultDUnit(value: string | undefined | null) {
    if (this._defaultDUnit !== value) {
      this._defaultDUnit = value || undefined;
      if (!this.dValue.value) {
        this.dUnit.setValue(value || 'cm');
      }
    }
  }

  // physical-size-units
  @Input()
  public unitEntries?: ThesaurusEntry[];

  // physical-size-tags
  @Input()
  public tagEntries?: ThesaurusEntry[];

  // physical-size-dim-tags
  @Input()
  public dimTagEntries?: ThesaurusEntry[];

  @Input()
  public hBeforeW?: boolean;

  @Output()
  public sizeChange: EventEmitter<PhysicalSize>;

  public form: FormGroup;
  public tag: FormControl<string | null>;
  public wValue: FormControl<number>;
  public wUnit: FormControl<string>;
  public wTag: FormControl<string | null>;
  public hValue: FormControl<number>;
  public hUnit: FormControl<string>;
  public hTag: FormControl<string | null>;
  public dValue: FormControl<number>;
  public dUnit: FormControl<string>;
  public dTag: FormControl<string | null>;
  public note: FormControl<string | null>;

  public label?: string;

  constructor(formBuilder: FormBuilder) {
    // events
    this.sizeChange = new EventEmitter<PhysicalSize>();
    // form
    this.tag = formBuilder.control(null, Validators.maxLength(50));

    this.wValue = formBuilder.control(0, { nonNullable: true });
    this.wUnit = formBuilder.control('cm', { nonNullable: true });
    this.wTag = formBuilder.control(null, Validators.maxLength(50));

    this.hValue = formBuilder.control(0, { nonNullable: true });
    this.hUnit = formBuilder.control('cm', { nonNullable: true });
    this.hTag = formBuilder.control(null, Validators.maxLength(50));

    this.dValue = formBuilder.control(0, { nonNullable: true });
    this.dUnit = formBuilder.control('cm', { nonNullable: true });
    this.dTag = formBuilder.control(null, Validators.maxLength(50));

    this.note = formBuilder.control(null, Validators.maxLength(100));

    this.form = formBuilder.group(
      {
        tag: this.tag,
        wValue: this.wValue,
        wUnit: this.wUnit,
        wTag: this.wTag,
        hValue: this.hValue,
        hUnit: this.hUnit,
        hTag: this.hTag,
        dValue: this.dValue,
        dUnit: this.dUnit,
        dTag: this.dTag,
        note: this.note,
      },
      {
        validators: this.validateUnit,
      }
    );
  }

  ngOnInit(): void {
    if (this.parentForm) {
      this.parentForm.addControl('size', this.form);
    }

    this.form.valueChanges.pipe(debounceTime(400)).subscribe((_) => {
      this._size = this.getModel();

      if (this.isModelValid(this._size) && this.tag.valid && this.note.valid) {
        this.updateLabel();
        this.sizeChange.emit(this._size);
      }
    });

    this.updateForm(this.size);
  }

  private validateUnit(form: FormGroup): { [key: string]: any } | null {
    const w = form.get('wValue')?.value || 0;
    const h = form.get('hValue')?.value || 0;
    const d = form.get('dValue')?.value || 0;

    if (w && !form.get('wUnit')?.value) {
      return {
        unit: true,
      };
    }
    if (h && !form.get('hUnit')?.value) {
      return {
        unit: true,
      };
    }
    if (d && !form.get('dUnit')?.value) {
      return {
        unit: true,
      };
    }

    return null;
  }

  private getDimensionLabel(value: number, unit?: string | null): string {
    if (!value) {
      return '';
    }
    let s = value.toFixed(2);
    if (unit) {
      s += ' ' + unit;
    }
    return s;
  }

  private isModelValid(model: PhysicalSize): boolean {
    if (!model) {
      return false;
    }
    return (
      // at least 1 dim with unit
      ((model.w?.value && !!model.w.unit) ||
        (model.h?.value && !!model.h.unit) ||
        (model.d?.value && !!model.d.unit)) &&
        // no dim without unit
        !(model.w?.value && !model.w.unit) &&
        !(model.h?.value && !model.h.unit) &&
        !(model.d?.value && !model.d.unit)
        ? true
        : false
    );
  }

  private updateLabel(): void {
    const sb: string[] = [];

    // determine the unique unit if any
    let uniqueUnit: string | undefined = undefined;
    if (this.wValue.value) {
      uniqueUnit = this.wUnit.value;
    }

    if (this.hValue.value) {
      if (!uniqueUnit) {
        uniqueUnit = this.hUnit.value;
      } else if (uniqueUnit !== this.hUnit.value) {
        uniqueUnit = undefined;
      }
    }

    if (this.dValue.value) {
      if (!uniqueUnit) {
        uniqueUnit = this.dUnit.value;
      } else if (uniqueUnit !== this.dUnit.value) {
        uniqueUnit = undefined;
      }
    }

    if (this.hBeforeW) {
      if (this.hValue.value) {
        sb.push(
          this.getDimensionLabel(
            this.hValue.value,
            uniqueUnit ? null : this.hUnit.value
          )
        );
      }
      if (this.wValue.value) {
        sb.push(
          this.getDimensionLabel(
            this.wValue.value,
            uniqueUnit ? null : this.wUnit.value
          )
        );
      }
    } else {
      if (this.wValue.value) {
        sb.push(
          this.getDimensionLabel(
            this.wValue.value,
            uniqueUnit ? null : this.wUnit.value
          )
        );
      }
      if (this.hValue.value) {
        sb.push(
          this.getDimensionLabel(
            this.hValue.value,
            uniqueUnit ? null : this.hUnit.value
          )
        );
      }
    }
    if (this.dValue.value) {
      sb.push(
        this.getDimensionLabel(
          this.dValue.value,
          uniqueUnit ? null : this.dUnit.value
        )
      );
    }

    this.label = sb.join(' × ') + (uniqueUnit ? ' ' + uniqueUnit : '');
  }

  private resetUnits(): void {
    this.wUnit.setValue(this.defaultWUnit || 'cm');
    this.hUnit.setValue(this.defaultHUnit || 'cm');
    this.dUnit.setValue(this.defaultDUnit || 'cm');
  }

  private updateForm(model?: PhysicalSize | null): void {
    if (!model) {
      this.form.reset();
      this.resetUnits();
      this.label = undefined;
    } else {
      this.tag.setValue(model.tag || null);
      this.note.setValue(model.note || null);

      if (model.w?.value) {
        this.wValue.setValue(model.w.value);
        this.wUnit.setValue(model.w.unit);
        this.wTag.setValue(model.w.tag || null);
      } else {
        this.wValue.reset();
        this.wUnit.setValue(this.defaultWUnit || 'cm');
        this.wTag.reset();
      }

      if (model.h?.value) {
        this.hValue.setValue(model.h.value);
        this.hUnit.setValue(model.h.unit);
        this.hTag.setValue(model.h.tag || null);
      } else {
        this.hValue.reset();
        this.hUnit.setValue(this.defaultHUnit || 'cm');
        this.hTag.reset();
      }

      if (model.d?.value) {
        this.dValue.setValue(model.d.value);
        this.dUnit.setValue(model.d.unit);
        this.dTag.setValue(model.d.tag || null);
      } else {
        this.dValue.reset();
        this.dUnit.setValue(this.defaultDUnit || 'cm');
        this.dTag.reset();
      }

      this.form.markAsPristine();
      this.updateLabel();
    }
  }

  private getDimension(
    v: FormControl,
    u: FormControl,
    t: FormControl
  ): PhysicalDimension {
    return {
      value: v.value || 0,
      unit: u.value,
      tag: t.value?.trim(),
    };
  }

  private getModel(): PhysicalSize {
    return {
      tag: this.tag.value?.trim(),
      note: this.note.value?.trim(),
      w: this.wValue.value
        ? this.getDimension(this.wValue, this.wUnit, this.wTag)
        : undefined,
      h: this.hValue.value
        ? this.getDimension(this.hValue, this.hUnit, this.hTag)
        : undefined,
      d: this.dValue.value
        ? this.getDimension(this.dValue, this.dUnit, this.dTag)
        : undefined,
    };
  }
}
