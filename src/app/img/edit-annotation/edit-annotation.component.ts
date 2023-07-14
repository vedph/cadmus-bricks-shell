import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ListAnnotation } from 'projects/myrmidon/cadmus-img-annotator/src/public-api';

@Component({
  selector: 'app-edit-annotation',
  templateUrl: './edit-annotation.component.html',
  styleUrls: ['./edit-annotation.component.css'],
})
export class EditAnnotationComponent {
  private _annotation?: ListAnnotation<any>;

  @Input()
  public get annotation(): ListAnnotation<any> | undefined {
    return this._annotation;
  }
  public set annotation(value: ListAnnotation<any> | undefined) {
    if (this._annotation === value) {
      return;
    }
    this._annotation = value;
    this.updateForm(this._annotation);
  }

  @Output()
  public cancel: EventEmitter<any>;

  @Output()
  public annotationChange: EventEmitter<ListAnnotation<any>>;

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
    this.annotationChange = new EventEmitter<ListAnnotation<any>>();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.txtElementRef?.nativeElement.focus();
    });
  }

  private updateForm(annotation?: ListAnnotation<any>): void {
    if (!annotation) {
      this.form.reset();
      return;
    }

    this.text.setValue(
      annotation.value.body?.length ? annotation.value.body[0].value : ''
    );
    this.form.markAsPristine();
  }

  private getAnnotation(): ListAnnotation<any> {
    if (this._annotation!.value.body!.length === 0) {
      this._annotation!.value.body!.push({
        type: 'TextualBody',
        value: this.text.value || '',
        purpose: 'commenting',
      });
    } else {
      this._annotation!.value!.body![0].value = this.text.value || '';
    }
    let a: ListAnnotation<any> = {
      id: this._annotation!.id,
      value: this._annotation!.value,
      payload: this._annotation!.payload,
    };
    return a;
  }

  public close(): void {
    this.cancel.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    this._annotation = this.getAnnotation();
    this.annotationChange.emit(this.annotation);
  }
}
