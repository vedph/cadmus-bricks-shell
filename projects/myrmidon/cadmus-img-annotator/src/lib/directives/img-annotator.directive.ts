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
 * The annotation in the AnnotationEvent.
 */
export interface AnnotationEventEntry {
  id: string;
  '@context': string;
  type: string;
  body?: [
    {
      type: string;
      value: string;
      purpose: string;
    }
  ];
  target: {
    source: string;
    selector: {
      type: string;
      conformsTo: string;
      value: string;
    };
  };
}

/**
 * Annotorious annotation event.
 */
export interface AnnotationEvent {
  /**
   * The annotation involved in this event.
   */
  annotation: AnnotationEventEntry;
  /**
   * The annotation before it was updated.
   */
  prevAnnotation?: AnnotationEventEntry;
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
  private _tool: string;
  private _annotations: any[];
  private _selectedAnnotation?: any;

  /**
   * The initial configuration for the annotator. Note that the image property
   * will be overridden with the img being decorated by this directive.
   */
  @Input()
  public config?: AnnotoriousConfig;

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
   * Emitted when a new annotation is created.
   */
  @Output()
  public createAnnotation: EventEmitter<AnnotationEvent>;

  /**
   * Emitted when an annotation is updated.
   */
  @Output()
  public updateAnnotation: EventEmitter<AnnotationEvent>;

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

  constructor(private _elementRef: ElementRef<HTMLImageElement>) {
    this._tool = 'rect';
    this._annotations = [];
    this.createAnnotation = new EventEmitter<AnnotationEvent>();
    this.updateAnnotation = new EventEmitter<AnnotationEvent>();
    this.deleteAnnotation = new EventEmitter<AnnotationEvent>();
    this.mouseEnterAnnotation = new EventEmitter<AnnotationEvent>();
    this.mouseLeaveAnnotation = new EventEmitter<AnnotationEvent>();
  }

  ngAfterViewInit() {
    const cfg = this.config || {};
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
  }
}
