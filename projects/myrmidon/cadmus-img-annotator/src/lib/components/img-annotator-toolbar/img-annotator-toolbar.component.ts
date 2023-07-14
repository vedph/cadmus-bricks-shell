import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface ImgAnnotatorToolbarTool {
  id: string;
  icon: string;
  tip: string;
}

@Component({
  selector: 'cadmus-img-annotator-toolbar',
  templateUrl: './img-annotator-toolbar.component.html',
  styleUrls: ['./img-annotator-toolbar.component.css'],
})
export class ImgAnnotatorToolbarComponent implements OnInit, OnDestroy {
  private _tools: ImgAnnotatorToolbarTool[];
  private _sub?: Subscription;

  @Input()
  public get tools(): ImgAnnotatorToolbarTool[] {
    return this._tools;
  }
  public set tools(value: ImgAnnotatorToolbarTool[]) {
    if (this._tools === value) {
      return;
    }
    this._tools = value;
    if (value.length) {
      this.form.get('tool')!.setValue(value[0].id);
    }
  }

  @Output()
  public toolChange: EventEmitter<string>;

  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this._tools = [
      { id: 'rect', icon: 'rectangle', tip: 'Rectangle' },
      { id: 'polygon', icon: 'polyline', tip: 'Polygon' },
      { id: 'circle', icon: 'radio_button_unchecked', tip: 'Circle' },
      { id: 'ellipse', icon: 'exposure_zero', tip: 'Ellipse' },
      { id: 'freehand', icon: 'gesture', tip: 'Freehand' },
    ];
    this.form = formBuilder.group({
      tool: ['rect'],
    });
    // event
    this.toolChange = new EventEmitter<string>();
  }

  public ngOnInit(): void {
    // ensure that a first value is emitted
    this.toolChange.emit(this.form.value.tool);

    // whenever form value changes, emit toolChange
    this._sub = this.form.valueChanges.subscribe((value) => {
      this.toolChange.emit(value.tool);
    });
  }

  public ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }
}
