import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { debounceTime } from 'rxjs/operators';

/**
 * Base class for in-place editor components. These components
 * do not require user to press a save button, as any change
 * made is reflected in the parent consumer control. Such editors
 * are fit for editing submodels in part editors.
 * The general architecture for this family of components stores
 * the model in an input model$ property (a BehaviorSubject<T> where
 * T is the model's type), so that the form can be updated whenever
 * the model gets pushed into this component.
 * Also, a parentForm property can be used to add the root form
 * of this component as a child of that form, so that the state
 * of this form can affect that of the parent.
 * When the user edits data, a new model gets built from the form
 * and the modelChange event is fired. The consumer parent component
 * should handle this event to get the updated model.
 */
@Component({
  template: '',
})
export abstract class InplaceEditorComponentBase<T> implements OnDestroy {
  protected modelSubscription?: Subscription;
  protected modelSubject?: BehaviorSubject<T>;

  /**
   * The optional parent form this component should attach to.
   * Set this when the form in this component should contribute
   * to the state of a parent form in the consumer control.
   */
  @Input()
  public parentForm?: FormGroup;

  /**
   * The IDs edited by this component, wrapped in a subject
   * stream. This component updates when the stream updates.
   */
  @Input()
  public get model$(): BehaviorSubject<T> | undefined {
    return this.modelSubject;
  }
  public set model$(value: BehaviorSubject<T> | undefined) {
    this.modelSubject = value;

    // unsubscribe the previous observable if any
    if (this.modelSubscription) {
      this.modelSubscription.unsubscribe();
    }
    // subscribe to the new observable
    if (this.modelSubject) {
      this.modelSubscription = this.modelSubject.subscribe((m) => {
        this.setModel(m);
      });
    }
  }

  /**
   * Event emitted whenever the user has changed the model.
   * The consumer component should subscribe to this to get
   * a copy of the updated model.
   */
  @Output()
  public modelChange: EventEmitter<T>;

  /**
   * The form grouping the controls of this editor.
   */
  public form: FormGroup;

  constructor(protected formBuilder: FormBuilder) {
    // events
    this.modelChange = new EventEmitter<T>();
    this.form = formBuilder.group({});
  }

  /**
   * Initialize the editor. Your implementation MUST call this method
   * in its ngOnInit.
   * @param formName The name to be assigned to the form grouping
   * all the controls of this component (=this.form), when it gets
   * added to a parent form.
   * @param formControls The configuration for the controls of this
   * component.
   */
  public initEditor(
    formName: string,
    formControls: { [key: string]: any }
  ): void {
    this.form = this.formBuilder.group(formControls);

    // add it as a child form to the parent, if any.
    // This propagates this form's state into it.
    if (this.parentForm) {
      this.parentForm.addControl(formName, this.form);
    }

    // once we are initialized, set the model to the current
    // value, because if it was set meantime it would be lost
    if (this.modelSubject) {
      this.setModel(this.modelSubject.value);
    }

    // react on this form changes
    this.form.valueChanges.pipe(debounceTime(300)).subscribe((_) => {
      const m = this.getModel();
      if (m) {
        this.modelChange.emit(m);
      }
    });
  }

  /**
   * Set the model for this component, updating the form accordingly.
   * @param value The model.
   */
  protected abstract setModel(value: T | null): void;

  /**
   * Get the model for this component, from the form controls.
   */
  protected abstract getModel(): T;

  /**
   * Unsubscribe from the model subscription.
   */
  public ngOnDestroy(): void {
    if (this.modelSubscription) {
      this.modelSubscription.unsubscribe();
    }
  }
}
