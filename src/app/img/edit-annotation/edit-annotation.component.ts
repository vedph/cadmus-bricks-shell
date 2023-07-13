import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AnnotationBodyEntry,
  Annotation,
} from 'projects/myrmidon/cadmus-img-annotator/src/public-api';

@Component({
  selector: 'app-edit-annotation',
  templateUrl: './edit-annotation.component.html',
  styleUrls: ['./edit-annotation.component.css'],
})
export class EditAnnotationComponent {
  private _annotation?: Annotation;

  @Input()
  public get annotation(): Annotation | undefined {
    return this._annotation;
  }
  public set annotation(value: Annotation | undefined) {
    if (this._annotation === value) {
      return;
    }
    this._annotation = value;
    this.updateForm(this._annotation);
  }

  @Output()
  public cancel: EventEmitter<any>;

  @Output()
  public annotationChange: EventEmitter<Annotation>;

  @ViewChild('txt') txtElementRef?: ElementRef<HTMLTextAreaElement>;

  public text: FormControl<string | null>;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.text = formBuilder.control(null, {
      validators: [Validators.required, Validators.maxLength(100)],
      nonNullable: true,
    });
    this.form = formBuilder.group({
      text: this.text,
    });
    // events
    this.cancel = new EventEmitter<any>();
    this.annotationChange = new EventEmitter<Annotation>();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.txtElementRef?.nativeElement.focus();
    });
  }

  private updateForm(selection?: Annotation): void {
    if (!selection) {
      this.form.reset();
      return;
    }
    this.text.setValue(selection.body?.length ? selection.body[0].value : '');
    this.form.markAsPristine();
  }

  public close(): void {
    this.cancel.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    const selection = this.annotation;
    if (!selection) {
      return;
    }
    const old: AnnotationBodyEntry = selection.body?.length
      ? selection.body[0]
      : ({} as AnnotationBodyEntry);
    selection.body = [
      {
        ...old,
        value: this.text.value || '',
      },
    ];
    this.annotation = selection;
    this.annotationChange.emit(selection);
  }
}
