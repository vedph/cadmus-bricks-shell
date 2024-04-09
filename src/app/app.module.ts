import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';

// vendor
import { MarkdownModule } from 'ngx-markdown';

import {
  CadmusCoreModule,
  IndexLookupDefinitions,
} from '@myrmidon/cadmus-core';
import {
  CadmusApiModule,
  ItemService,
  ThesaurusService,
} from '@myrmidon/cadmus-api';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

// refs bricks
import { CadmusCodLocationModule } from 'projects/myrmidon/cadmus-cod-location/src/public-api';
import { CadmusImgAnnotatorModule } from 'projects/myrmidon/cadmus-img-annotator/src/public-api';
import { CadmusMatPhysicalSizeModule } from 'projects/myrmidon/cadmus-mat-physical-size/src/public-api';
import { CadmusRefsAssertedChronotopeModule } from 'projects/myrmidon/cadmus-refs-asserted-chronotope/src/public-api';
import { CadmusRefsAssertionModule } from 'projects/myrmidon/cadmus-refs-assertion/src/public-api';
import { CadmusRefsAssertedIdsModule } from 'projects/myrmidon/cadmus-refs-asserted-ids/src/public-api';
import { CadmusRefsChronotopeModule } from 'projects/myrmidon/cadmus-refs-chronotope/src/public-api';
import { CadmusRefsDecoratedIdsModule } from 'projects/myrmidon/cadmus-refs-decorated-ids/src/public-api';
import { CadmusRefsDocReferencesModule } from 'projects/myrmidon/cadmus-refs-doc-references/src/public-api';
import { CadmusRefsExternalIdsModule } from 'projects/myrmidon/cadmus-refs-external-ids/src/public-api';
import { CadmusRefsHistoricalDateModule } from 'projects/myrmidon/cadmus-refs-historical-date/src/public-api';
import { CadmusRefsProperNameModule } from 'projects/myrmidon/cadmus-refs-proper-name/src/public-api';
import { CadmusRefsLookupModule, PROXY_INTERCEPTOR_OPTIONS, ProxyInterceptor } from 'projects/myrmidon/cadmus-refs-lookup/src/public-api';
import { CadmusRefsDecoratedCountsModule } from 'projects/myrmidon/cadmus-refs-decorated-counts/src/public-api';
import { CadmusSdimgAnnotatorModule } from 'projects/myrmidon/cadmus-sdimg-annotator/src/public-api';
import { CadmusTextBlockViewModule } from 'projects/myrmidon/cadmus-text-block-view/src/public-api';
import { CadmusUiCustomActionBarModule } from 'projects/myrmidon/cadmus-ui-custom-action-bar/src/public-api';
import { CadmusUiFlagsPickerModule } from 'projects/myrmidon/cadmus-ui-flags-picker/src/public-api';
import { CadmusUiNoteSetModule } from 'projects/myrmidon/cadmus-ui-note-set/src/public-api';
import {
  CadmusImgGalleryModule,
  IMAGE_GALLERY_OPTIONS_KEY,
  IMAGE_GALLERY_SERVICE_KEY,
  // MockGalleryService,
} from 'projects/myrmidon/cadmus-img-gallery/src/public-api';
import {
  CadmusImgGalleryIiifModule,
  SimpleIiifGalleryOptions,
  SimpleIiifGalleryService,
} from 'projects/myrmidon/cadmus-img-gallery-iiif/src/public-api';
import { CadmusSdimgGalleryModule } from 'projects/myrmidon/cadmus-sdimg-gallery/src/public-api';

import { MockItemService } from './services/mock-item.service';
import { MockThesaurusService } from './services/mock-thesaurus.service';

import { AssertedChronotopeSetPgComponent } from './refs/asserted-chronotope-set-pg/asserted-chronotope-set-pg.component';
import { AssertedChronotopePgComponent } from './refs/asserted-chronotope-pg/asserted-chronotope-pg.component';
import { AssertedCompositeIdPgComponent } from './refs/asserted-composite-id-pg/asserted-composite-id-pg.component';
import { AssertedCompositeIdsPgComponent } from './refs/asserted-composite-ids-pg/asserted-composite-ids-pg.component';
import { AssertedIdPgComponent } from './refs/asserted-id-pg/asserted-id-pg.component';
import { AssertedIdsPgComponent } from './refs/asserted-ids-pg/asserted-ids-pg.component';
import { AssertionPgComponent } from './refs/assertion-pg/assertion-pg.component';
import { CodLocationPgComponent } from './cod/cod-location-pg/cod-location-pg.component';
import { CustomActionBarPgComponent } from './ui/custom-action-bar-pg/custom-action-bar-pg.component';
import { ChronotopePgComponent } from './refs/chronotope-pg/chronotope-pg.component';
import { ExternalIdsPgComponent } from './refs/external-ids-pg/external-ids-pg.component';
import { FlagsPickerPgComponent } from './ui/flags-picker-pg/flags-picker-pg.component';
import { ProperNamePgComponent } from './refs/proper-name-pg/proper-name-pg.component';
import { DecoratedCountsPgComponent } from './refs/decorated-counts-pg/decorated-counts-pg.component';
import { DecoratedIdsPgComponent } from './refs/decorated-ids-pg/decorated-ids-pg.component';
import { DocReferencesPgComponent } from './refs/doc-references-pg/doc-references-pg.component';
import { RefLookupDummyOptComponent } from './refs/ref-lookup-dummy-opt/ref-lookup-dummy-opt.component';
import { HistoricalDatePgComponent } from './refs/historical-date-pg/historical-date-pg.component';
import { ImgAnnotatorPgComponent } from './img/img-annotator-pg/img-annotator-pg.component';
import { ImgGalleryPgComponent } from './img/img-gallery-pg/img-gallery-pg.component';
import { RefLookupPgComponent } from './refs/ref-lookup-pg/ref-lookup-pg.component';
import { NoteSetPgComponent } from './ui/note-set-pg/note-set-pg.component';
import { PhysicalSizePgComponent } from './mat/physical-size-pg/physical-size-pg.component';
import { SdImgAnnotatorPgComponent } from './img/sd-img-annotator-pg/sd-img-annotator-pg.component';
import { SdImgGalleryPgComponent } from './img/sd-img-gallery-pg/sd-img-gallery-pg.component';
import { TextBlockViewPgComponent } from './text/text-block-view-pg/text-block-view-pg.component';
import { ViafRefLookupPgComponent } from './refs/viaf-ref-lookup-pg/viaf-ref-lookup-pg.component';
import { EditAnnotationComponent } from './img/edit-annotation/edit-annotation.component';
import { EditAnnotationDialogComponent } from './img/edit-annotation-dialog/edit-annotation-dialog.component';
import { MyImgAnnotationListComponent } from './img/img-annotation-list/my-img-annotation-list.component';
import { ImgAnnotatorToolbarPgComponent } from './img/img-annotator-toolbar-pg/img-annotator-toolbar-pg.component';
import { MyGalleryImageAnnotatorComponent } from './img/my-gallery-image-annotator/my-gallery-image-annotator.component';
import { RefLookupSetPgComponent } from './refs/ref-lookup-set-pg/ref-lookup-set-pg.component';
import { DbpediaRefLookupPgComponent } from './refs/dbpedia-ref-lookup-pg/dbpedia-ref-lookup-pg.component';
import { EmojiImePgComponent } from './text/emoji-ime-pg/emoji-ime-pg.component';

// for lookup in asserted IDs - note that this would require a backend
const INDEX_LOOKUP_DEFINITIONS: IndexLookupDefinitions = {
  item_eid: {
    typeId: 'it.vedph.metadata',
    name: 'eid',
  },
  alias_eid: {
    typeId: 'it.vedph.metadata',
    name: 'eid',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AssertedChronotopePgComponent,
    AssertedChronotopeSetPgComponent,
    AssertedCompositeIdPgComponent,
    AssertedCompositeIdsPgComponent,
    AssertionPgComponent,
    AssertedIdPgComponent,
    AssertedIdsPgComponent,
    ChronotopePgComponent,
    CodLocationPgComponent,
    CustomActionBarPgComponent,
    DocReferencesPgComponent,
    DecoratedIdsPgComponent,
    DecoratedCountsPgComponent,
    ExternalIdsPgComponent,
    FlagsPickerPgComponent,
    HistoricalDatePgComponent,
    ImgAnnotatorPgComponent,
    ImgGalleryPgComponent,
    NoteSetPgComponent,
    PhysicalSizePgComponent,
    ProperNamePgComponent,
    RefLookupPgComponent,
    RefLookupDummyOptComponent,
    SdImgAnnotatorPgComponent,
    SdImgGalleryPgComponent,
    TextBlockViewPgComponent,
    ViafRefLookupPgComponent,
    EditAnnotationComponent,
    EditAnnotationDialogComponent,
    MyImgAnnotationListComponent,
    ImgAnnotatorToolbarPgComponent,
    MyGalleryImageAnnotatorComponent,
    RefLookupSetPgComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'img/gallery', component: ImgGalleryPgComponent },
      { path: 'img/sd-gallery', component: SdImgGalleryPgComponent },
      { path: 'img/annotator', component: ImgAnnotatorPgComponent },
      { path: 'img/sd-annotator', component: SdImgAnnotatorPgComponent },
      { path: 'img/toolbar', component: ImgAnnotatorToolbarPgComponent },
      { path: 'refs/doc-references', component: DocReferencesPgComponent },
      { path: 'refs/external-ids', component: ExternalIdsPgComponent },
      {
        path: 'refs/decorated-counts',
        component: DecoratedCountsPgComponent,
      },
      { path: 'refs/decorated-ids', component: DecoratedIdsPgComponent },
      { path: 'refs/proper-name', component: ProperNamePgComponent },
      { path: 'refs/assertion', component: AssertionPgComponent },
      { path: 'refs/asserted-id', component: AssertedIdPgComponent },
      { path: 'refs/asserted-ids', component: AssertedIdsPgComponent },
      {
        path: 'refs/asserted-composite-id',
        component: AssertedCompositeIdPgComponent,
      },
      {
        path: 'refs/asserted-composite-ids',
        component: AssertedCompositeIdsPgComponent,
      },
      { path: 'refs/chronotope', component: ChronotopePgComponent },
      {
        path: 'refs/asserted-chronotope',
        component: AssertedChronotopePgComponent,
      },
      {
        path: 'refs/asserted-chronotope-set',
        component: AssertedChronotopeSetPgComponent,
      },
      { path: 'refs/historical-date', component: HistoricalDatePgComponent },
      { path: 'refs/lookup', component: RefLookupPgComponent },
      { path: 'refs/lookup-set', component: RefLookupSetPgComponent },
      { path: 'refs/viaf-lookup', component: ViafRefLookupPgComponent },
      { path: 'refs/dbpedia-lookup', component: DbpediaRefLookupPgComponent },
      { path: 'ui/flags-picker', component: FlagsPickerPgComponent },
      { path: 'ui/note-set', component: NoteSetPgComponent },
      {
        path: 'ui/custom-actions-bar',
        component: CustomActionBarPgComponent,
      },
      { path: 'text/text-block-view', component: TextBlockViewPgComponent },
      { path: 'text/emoji-ime', component: EmojiImePgComponent },
      { path: 'mat/physical-size', component: PhysicalSizePgComponent },
      { path: 'cod/location', component: CodLocationPgComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', component: HomeComponent },
    ]),
    // material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    ClipboardModule,
    // vendor
    MarkdownModule.forRoot(),
    // Cadmus
    CadmusCoreModule,
    CadmusApiModule,
    CadmusImgAnnotatorModule,
    CadmusImgGalleryModule,
    CadmusImgGalleryIiifModule,
    CadmusSdimgAnnotatorModule,
    CadmusSdimgGalleryModule,
    CadmusRefsDocReferencesModule,
    CadmusRefsDecoratedIdsModule,
    CadmusRefsExternalIdsModule,
    CadmusRefsProperNameModule,
    CadmusRefsAssertedChronotopeModule,
    CadmusRefsAssertionModule,
    CadmusRefsAssertedIdsModule,
    CadmusRefsChronotopeModule,
    CadmusRefsDecoratedCountsModule,
    CadmusRefsHistoricalDateModule,
    CadmusRefsLookupModule,
    CadmusTextBlockViewModule,
    CadmusMatPhysicalSizeModule,
    CadmusCodLocationModule,
    CadmusUiCustomActionBarModule,
    CadmusUiFlagsPickerModule,
    CadmusUiNoteSetModule,
  ],
  providers: [
    // dialog default
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        maxHeight: '800px',
      },
    },
    // proxy interceptor
    { provide: HTTP_INTERCEPTORS, useClass: ProxyInterceptor, multi: true },
    { provide: PROXY_INTERCEPTOR_OPTIONS, useValue: {
        proxyUrl: 'http://localhost:5161/api/proxy',
        urls: [
          'http://lookup.dbpedia.org/api/search',
          'http://lookup.dbpedia.org/api/prefix'
        ]
      }
    },
    // mocks for lookup
    {
      provide: 'indexLookupDefinitions',
      useValue: INDEX_LOOKUP_DEFINITIONS,
    },
    {
      provide: ItemService,
      useClass: MockItemService,
    },
    {
      provide: ThesaurusService,
      useClass: MockThesaurusService,
    },
    // if you want to use the mock gallery, uncomment these two providers
    // and comment the IIIF ones below.
    // mock image gallery
    // {
    //   provide: IMAGE_GALLERY_SERVICE_KEY,
    //   useClass: MockGalleryService,
    // },
    // {
    //   provide: IMAGE_GALLERY_OPTIONS_KEY,
    //   useValue: {
    //     baseUri: '',
    //     count: 50,
    //     width: 300,
    //     height: 400,
    //   },
    // },
    // IIIF image gallery
    {
      provide: IMAGE_GALLERY_SERVICE_KEY,
      useClass: SimpleIiifGalleryService,
    },
    {
      provide: IMAGE_GALLERY_OPTIONS_KEY,
      useValue: {
        baseUri: '',
        manifestUri:
          'https://dms-data.stanford.edu/data/manifests/Parker/xj710dc7305/manifest.json',
        arrayPath: 'sequences[0]/canvases',
        resourcePath: 'images[0]/resource',
        labelPath: 'label',
        width: 300,
        height: 400,
        targetWidth: 800,
        targetHeight: -1,
        pageSize: 6,
        // skip: 6
      } as SimpleIiifGalleryOptions,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
