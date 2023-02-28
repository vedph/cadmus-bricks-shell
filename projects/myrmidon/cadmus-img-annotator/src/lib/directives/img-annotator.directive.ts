import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Annotorious } from '@recogito/annotorious';

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
  private _tool: string;
  private _ann?: any;

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
  public annotations?: any[];

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
    // initial annotations
    if (this.annotations?.length) {
      this._ann.setAnnotations(this.annotations);
    }
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
