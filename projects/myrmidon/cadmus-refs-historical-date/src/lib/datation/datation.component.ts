import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

import { Datation, DatationModel } from '@myrmidon/cadmus-core';

import { InplaceEditorComponentBase } from '../inplace-editor-component-base';

/**
 * Editor for a single point in a historical date.
 */
@Component({
  selector: 'cadmus-refs-datation',
  templateUrl: './datation.component.html',
  styleUrls: ['./datation.component.css'],
})
export class DatationComponent
  extends InplaceEditorComponentBase<DatationModel>
  implements OnInit
{
  public value: FormControl;
  public century: FormControl;
  public span: FormControl;
  public month: FormControl;
  public day: FormControl;
  public about: FormControl;
  public dubious: FormControl;
  public hint: FormControl;

  /**
   * The optional label to display for this datation.
   */
  @Input() public label?: string;

  /**
   * The optional custom ID to be assigned to this component's
   * form as a child of the parentForm. The default is "datation".
   */
  @Input() public idInParentForm: string;

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
    this.value = this.formBuilder.control(0);
    this.century = this.formBuilder.control(false);
    this.span = this.formBuilder.control(false);
    this.month = this.formBuilder.control(0, [
      Validators.min(0),
      Validators.max(12),
    ]);
    this.day = this.formBuilder.control(0, [
      Validators.min(0),
      Validators.max(31),
    ]);
    this.about = this.formBuilder.control(false);
    this.dubious = this.formBuilder.control(false);
    this.hint = this.formBuilder.control(null, Validators.maxLength(500));
    this.idInParentForm = 'datation';
  }

  public ngOnInit(): void {
    this.initEditor(this.idInParentForm || 'datation', {
      value: this.value,
      century: this.century,
      span: this.span,
      month: this.month,
      day: this.day,
      about: this.about,
      dubious: this.dubious,
      hint: this.hint,
    });
  }

  protected setModel(model: DatationModel): void {
    if (!this.form) {
      return;
    }
    if (!model) {
      this.form.reset();
    } else {
      this.value.setValue(model.value);
      this.century.setValue(model.isCentury);
      this.span.setValue(model.isSpan);
      this.month.setValue(model.month);
      this.day.setValue(model.day);
      this.about.setValue(model.isApproximate);
      this.dubious.setValue(model.isDubious);
      this.hint.setValue(model.hint);
      this.form.markAsPristine();
    }
  }

  protected getModel(): DatationModel {
    return {
      value: this.value.value ? +this.value.value : 0,
      isCentury: this.century.value || false,
      isSpan: this.span.value || false,
      month: this.month.value ? +this.month.value : 0,
      day: this.day.value ? +this.day.value : 0,
      isApproximate: this.about.value || false,
      isDubious: this.dubious.value || false,
      hint: Datation.sanitizeHint(this.hint.value),
    };
  }
}
