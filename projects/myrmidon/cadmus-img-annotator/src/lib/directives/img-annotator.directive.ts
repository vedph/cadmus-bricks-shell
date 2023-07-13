import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
// @ts-ignore
import { Annotorious } from '@recogito/annotorious';
// @ts-ignore
import SelectorPack from '@recogito/annotorious-selector-pack';

// https://recogito.github.io/annotorious/api-docs/annotorious

/**
 * Annotorious formatter function.
 */
export type AnnotoriousFormatter = (
  annotation: any
) => string | HTMLElement | object;

/**
 * Annotorious configuration.
 */
export interface AnnotoriousConfig {
  allowEmpty?: boolean;
  crosshair?: boolean;
  // https://annotorious.github.io/guides/headless-mode
  disableEditor?: boolean;
  disableSelect?: boolean;
  drawOnSingleClick?: boolean;
  formatters?: AnnotoriousFormatter | AnnotoriousFormatter[];
  fragmentUnit?: 'pixel' | 'percent';
  handleRadius?: number;
  image?: HTMLImageElement | string;
  locale?: string;
  messages?: { [key: string]: string };
  readOnly?: boolean;
  widgets?: any[];
}

/**
 * An annotation selector in target.
 */
export interface AnnotationSelector {
  type: string;
  conformsTo: string;
  value: string;
}

/**
 * An annotation target.
 */
export interface AnnotationTarget {
  source: string;
  selector: AnnotationSelector;
}

/**
 * An annotation body entry.
 */
export interface AnnotationBodyEntry {
  type: string;
  value: string;
  purpose: string;
}

/**
 * An annotation.
 */
export interface Annotation {
  id?: string;
  '@context': string;
  type: string;
  body?: AnnotationBodyEntry[];
  target: AnnotationTarget;
}

/**
 * Annotorious annotation event.
 */
export interface AnnotationEvent {
  /**
   * The annotation involved in this event.
   */
  annotation: Annotation;
  /**
   * The annotation before it was updated.
   */
  prevAnnotation?: Annotation;
  /**
   * The function to optionally override a new annotation's ID.
   */
  overrideId?: (id: any) => void;
}

/**
 * Essential directive wrapping Recogito's Annotorious.
 * Add as an attribute to your img element (cadmusImgAnnotator).
 */
@Directive({
  selector: '[cadmusImgAnnotator]',
})
export class ImgAnnotatorDirective {
  private _ann?: any;
  private _config?: AnnotoriousConfig;
  private _disableEditor?: boolean;
  private _tool: string;
  private _annotations: any[];
  private _selectedAnnotation?: any;

  /**
   * The initial configuration for the annotator. Note that the image property
   * will be overridden with the img being decorated by this directive.
   */
  @Input()
  public get config(): AnnotoriousConfig | undefined {
    return this._config;
  }
  public set config(value: AnnotoriousConfig | undefined) {
    if (this._config === value) {
      return;
    }
    this._config = value;
    this._ann?.destroy();
    this.initAnnotator();
  }

  /**
   * Disables the editor thus toggling the headless mode.
   */
  @Input()
  public get disableEditor(): boolean | undefined {
    return this._disableEditor;
  }
  public set disableEditor(value: boolean | undefined) {
    if (this._disableEditor === value) {
      return;
    }
    this._disableEditor = value;
    // https://annotorious.github.io/guides/headless-mode/
    this._ann.disableEditor = value;
  }

  /**
   * The current drawing tool. The default available tools are rect and polygon,
   * but more can be available from plugins.
   */
  @Input()
  public get tool(): string {
    return this._tool;
  }
  public set tool(value: string) {
    if (this._tool === value) {
      return;
    }
    this._tool = value;
    this._ann?.setDrawingTool(this._tool);
  }

  /**
   * The optional initial annotations to show on the image.
   */
  @Input()
  public get annotations(): any[] {
    return this._annotations;
  }
  public set annotations(value: any[]) {
    if (!value || !value.length) {
      this._ann?.clearAnnotations();
      return;
    }
    if (this._annotations === value) {
      return;
    }
    this._annotations = value;
    this._ann?.setAnnotations(this._annotations);
  }

  /**
   * The selected annotation or its ID. When set, the annotator
   * will highlight the annotation and open its editor.
   */
  @Input()
  public get selectedAnnotation(): any | undefined | null {
    return this._selectedAnnotation;
  }
  public set selectedAnnotation(value: any | undefined | null) {
    this._selectedAnnotation = value || undefined;
    this._ann?.selectAnnotation(value);
  }

  /**
   * The IDs of all the additional selection tools to be used
   * when the Annotorious Selector Pack plugin is loaded
   * (see https://github.com/recogito/annotorious-selector-pack).
   * Allowed values (besides 'rect', 'polygon'): 'point', 'circle',
   * 'ellipse', 'freehand'. Note that this requires to add the
   * plugins library to your app (@recogito/annotorious-selector-pack).
   */
  @Input()
  public additionalTools?: string[];

  /**
   * Fired when the annotator has been initialized. This is a way
   * for passing the annotator itself to the parent component.
   * The annotator is required in headless mode, so that your code
   * can replace the current selection by modifying the received
   * selection and calling annotator.updateSelected(selection, true).
   */
  @Output()
  public annotatorInit: EventEmitter<any>;

  /**
   * Fired when the user has canceled a selection, by hitting Cancel in
   * the editor, or by clicking or tapping outside the selected annotation
   * shape.
   */
  @Output()
  public cancelSelected: EventEmitter<Annotation>;

  /**
   * Fired when the shape of a newly created selection, or of a selected
   * annotation is moved or resized. The argument is the annotation target.
   */
  @Output()
  public changeSelectionTarget: EventEmitter<any>;

  /**
   * Fired every time the user clicks an annotation (regardless of whether
   * it is already selected or not).
   */
  @Output()
  public clickAnnotation: EventEmitter<AnnotationEvent>;

  /**
   * Emitted when a new annotation is created.
   */
  @Output()
  public createAnnotation: EventEmitter<AnnotationEvent>;

  /**
   * Fires when the user has created a new selection (headless mode).
   * The handler should modify the selected annotation and call
   * updateSelected (which is an async function returning a Promise)
   * to replace it.
   */
  @Output()
  public createSelection: EventEmitter<Annotation>;

  /**
   * Emitted when an annotation is deleted.
   */
  @Output()
  public deleteAnnotation: EventEmitter<AnnotationEvent>;

  /**
   * Emitted when mouse enters an annotation.
   */
  @Output()
  public mouseEnterAnnotation: EventEmitter<AnnotationEvent>;

  /**
   * Emitted when mouse exits an annotation.
   */
  @Output()
  public mouseLeaveAnnotation: EventEmitter<AnnotationEvent>;

  /**
   * Fires when the user selects an existing annotation (headless mode).
   * The user can then move or delete the annotation; the corresponding
   * events will be fired (after moving, the updateAnnotation event when
   * the user clicks outside the shape, or draws another one; after
   * deleting, the deleteAnnotation event).
   */
  @Output()
  public selectAnnotation: EventEmitter<Annotation>;

  /**
   * Emitted when an annotation is updated.
   */
  @Output()
  public updateAnnotation: EventEmitter<AnnotationEvent>;

  constructor(private _elementRef: ElementRef<HTMLImageElement>) {
    this._tool = 'rect';
    this._annotations = [];
    this._disableEditor = true;
    // events
    this.annotatorInit = new EventEmitter<any>();
    this.cancelSelected = new EventEmitter<Annotation>();
    this.changeSelectionTarget = new EventEmitter<any>();
    this.clickAnnotation = new EventEmitter<AnnotationEvent>();
    this.createSelection = new EventEmitter<Annotation>();
    this.createAnnotation = new EventEmitter<AnnotationEvent>();
    this.deleteAnnotation = new EventEmitter<AnnotationEvent>();
    this.mouseEnterAnnotation = new EventEmitter<AnnotationEvent>();
    this.mouseLeaveAnnotation = new EventEmitter<AnnotationEvent>();
    this.selectAnnotation = new EventEmitter<Annotation>();
    this.updateAnnotation = new EventEmitter<AnnotationEvent>();
  }

  private initAnnotator(): void {
    const cfg = this.config || { disableEditor: true }; //@@
    cfg.image = this._elementRef.nativeElement;
    this._ann = new Annotorious(cfg);

    // plugin
    if (this.additionalTools?.length) {
      SelectorPack(this._ann, {
        tools: this.additionalTools,
      });
    }

    // initial annotations
    this._ann.setAnnotations(this._annotations || []);

    // wrap events:
    // createSelection
    this._ann.on('createSelection', (selection: Annotation) => {
      this.createSelection.emit(selection);
    });
    // selectAnnotation
    this._ann.on('selectAnnotation', (selection: Annotation) => {
      this.selectAnnotation.emit(selection);
    });
    // cancelSelected
    this._ann.on('cancelSelected', (selection: Annotation) => {
      this.cancelSelected.emit(selection);
    });

    // createAnnotation
    this._ann.on(
      'createAnnotation',
      (annotation: any, overrideId: (id: any) => void) => {
        this.createAnnotation.emit({
          annotation,
          overrideId,
        });
      }
    );
    // updateAnnotation
    this._ann.on('updateAnnotation', (annotation: any, previous: any) => {
      this.updateAnnotation.emit({ annotation, prevAnnotation: previous });
    });
    // deleteAnnotation
    this._ann.on('deleteAnnotation', (annotation: any) => {
      this.deleteAnnotation.emit({ annotation });
    });
    // mouse
    this._ann.on(
      'mouseEnterAnnotation',
      (annotation: any, element: HTMLElement) => {
        this.mouseEnterAnnotation.emit({ annotation });
      }
    );
    this._ann.on(
      'mouseLeaveAnnotation',
      (annotation: any, element: HTMLElement) => {
        this.mouseLeaveAnnotation.emit({ annotation });
      }
    );

    // default drawing tool
    if (this._tool !== 'rect') {
      this._ann.setDrawingTool(this._tool);
    }

    this.annotatorInit.emit(this._ann);
  }

  ngAfterViewInit() {
    this.initAnnotator();
  }
}
