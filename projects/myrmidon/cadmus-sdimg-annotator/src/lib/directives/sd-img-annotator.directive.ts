import {
  Directive,
  Input,
  Output,
  EventEmitter,
  NgZone,
  ElementRef,
} from '@angular/core';
import {
  Annotation,
  AnnotationEvent,
  AnnotoriousConfig,
} from '@myrmidon/cadmus-img-annotator';
// @ts-ignore
import * as OSDAnnotorious from '@recogito/annotorious-openseadragon';
import { Viewer } from 'openseadragon';
// @ts-ignore
import SelectorPack from '@recogito/annotorious-selector-pack';

@Directive({
  selector: '[cadmusSdImgAnnotator]',
})
export class SdImgAnnotatorDirective {
  private _ann?: any;
  private _config?: AnnotoriousConfig;
  private _disableEditor?: boolean;
  private _tool: string;
  private _annotations: any[];
  private _selectedAnnotation?: any;

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

  constructor(private _ngZone: NgZone, private el: ElementRef) {
    this._tool = 'rect';
    this._annotations = [];
    this._disableEditor = true;
    this.source = '';
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
    // here we use a single image source from the target img @src:
    //   http://openseadragon.github.io/examples/tilesource-image/
    // we also have better running outside Angular zone:
    //   http://openseadragon.github.io/docs/
    const viewer = this._ngZone.runOutsideAngular(() => {
      return new Viewer({
        element: this.el.nativeElement,
        tileSources: {
          type: 'image',
          url: this.source,
        },
        prefixUrl: 'http://openseadragon.github.io/openseadragon/images/',
      });
    });

    this._ann = OSDAnnotorious(viewer, cfg);

    // plugin
    if (this.additionalTools?.length) {
      SelectorPack(this._ann, {
        tools: this.additionalTools,
      });
    }

    // initial annotations
    this._ann.setAnnotations(this._annotations || []);

    // wrap events:

    // initial annotations
    if (this.annotations?.length) {
      this._ann.setAnnotations(this.annotations);
    }
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
