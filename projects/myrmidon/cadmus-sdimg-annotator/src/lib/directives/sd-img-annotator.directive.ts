import { Directive, Input, Output, EventEmitter, NgZone } from '@angular/core';
import {
  AnnotationEvent,
  AnnotoriousConfig,
} from '@myrmidon/cadmus-img-annotator';
import { Annotorious } from '@recogito/annotorious';
import * as OpenSeadragon from 'openseadragon';

@Directive({
  selector: '[cadmusSdImgAnnotator]',
})
export class SdImgAnnotatorDirective {
  private _tool: string;
  private _ann?: any;

  /**
   * The source image to annotate.
   * TODO: implement refresh logic in setter.
   */
  @Input()
  public source: string;

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

  constructor(private _ngZone: NgZone) {
    this._tool = 'rect';
    this.source = '';
    this.createAnnotation = new EventEmitter<AnnotationEvent>();
    this.updateAnnotation = new EventEmitter<AnnotationEvent>();
    this.deleteAnnotation = new EventEmitter<AnnotationEvent>();
    this.mouseEnterAnnotation = new EventEmitter<AnnotationEvent>();
    this.mouseLeaveAnnotation = new EventEmitter<AnnotationEvent>();
  }

  ngAfterViewInit() {
    const cfg = this.config || {};
    // here we use a single image source from the target img @src:
    //   http://openseadragon.github.io/examples/tilesource-image/
    // we also have better running outside Angular zone:
    //   http://openseadragon.github.io/docs/
    const viewer = this._ngZone.runOutsideAngular(() => {
      OpenSeadragon({
        id: 'osd',
        tileSources: {
          type: 'image',
          url: this.source,
        },
      });
    });
    // const viewer = OpenSeadragon({
    //   id: 'osd',
    //   tileSources: {
    //     type: 'image',
    //     url: this.source,
    //   },
    // });

    this._ann = new Annotorious(viewer, cfg);

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
