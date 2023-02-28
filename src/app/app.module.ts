import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
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

import { MarkdownModule } from 'ngx-markdown';

import {
  CadmusCoreModule,
  IndexLookupDefinitions,
} from '@myrmidon/cadmus-core';
import { CadmusApiModule, ItemService } from '@myrmidon/cadmus-api';

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
import { CadmusRefsLookupModule } from 'projects/myrmidon/cadmus-refs-lookup/src/public-api';
import { CadmusRefsDecoratedCountsModule } from 'projects/myrmidon/cadmus-refs-decorated-counts/src/public-api';
import { CadmusSdimgAnnotatorModule } from 'projects/myrmidon/cadmus-sdimg-annotator/src/public-api';
import { CadmusTextBlockViewModule } from 'projects/myrmidon/cadmus-text-block-view/src/public-api';
import { CadmusUiFlagsPickerModule } from 'projects/myrmidon/cadmus-ui-flags-picker/src/public-api';
import { CadmusUiNoteSetModule } from 'projects/myrmidon/cadmus-ui-note-set/src/public-api';

import { AssertedChronotopePgComponent } from './refs/asserted-chronotope-pg/asserted-chronotope-pg.component';
import { AssertedChronotopeSetPgComponent } from './refs/asserted-chronotope-set-pg/asserted-chronotope-set-pg.component';
import { AssertedIdPgComponent } from './refs/asserted-id-pg/asserted-id-pg.component';
import { AssertedIdsPgComponent } from './refs/asserted-ids-pg/asserted-ids-pg.component';
import { AssertionPgComponent } from './refs/assertion-pg/assertion-pg.component';
import { ChronotopePgComponent } from './refs/chronotope-pg/chronotope-pg.component';
import { CodLocationPgComponent } from './cod/cod-location-pg/cod-location-pg.component';
import { DecoratedCountsPgComponent } from './refs/decorated-counts-pg/decorated-counts-pg.component';
import { DecoratedIdsPgComponent } from './refs/decorated-ids-pg/decorated-ids-pg.component';
import { DocReferencesPgComponent } from './refs/doc-references-pg/doc-references-pg.component';
import { ExternalIdsPgComponent } from './refs/external-ids-pg/external-ids-pg.component';
import { HistoricalDatePgComponent } from './refs/historical-date-pg/historical-date-pg.component';
import { ImgAnnotatorPgComponent } from './img/img-annotator-pg/img-annotator-pg.component';
import { FlagsPickerPgComponent } from './ui/flags-picker-pg/flags-picker-pg.component';
import { ProperNamePgComponent } from './refs/proper-name-pg/proper-name-pg.component';
import { PhysicalSizePgComponent } from './mat/physical-size-pg/physical-size-pg.component';
import { RefLookupDummyOptComponent } from './refs/ref-lookup-dummy-opt/ref-lookup-dummy-opt.component';
import { RefLookupPgComponent } from './refs/ref-lookup-pg/ref-lookup-pg.component';
import { TextBlockViewPgComponent } from './text/text-block-view-pg/text-block-view-pg.component';
import { ViafRefLookupPgComponent } from './refs/viaf-ref-lookup-pg/viaf-ref-lookup-pg.component';
import { NoteSetPgComponent } from './ui/note-set-pg/note-set-pg.component';
import { MockItemService } from './services/mock-item.service';
import { SdImgAnnotatorPgComponent } from './img/sd-img-annotator-pg/sd-img-annotator-pg.component';
import { ImgGalleryPgComponent } from './img/img-gallery-pg/img-gallery-pg.component';
import {
  CadmusImgGalleryModule,
  IMAGE_GALLERY_OPTIONS_KEY,
  IMAGE_GALLERY_SERVICE_KEY,
  MockGalleryService,
} from 'projects/myrmidon/cadmus-img-gallery/src/public-api';

// for lookup in asserted IDs - note that this would require a backend
const INDEX_LOOKUP_DEFINITIONS: IndexLookupDefinitions = {
  item_eid: {
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
    AssertionPgComponent,
    AssertedIdPgComponent,
    AssertedIdsPgComponent,
    ChronotopePgComponent,
    DocReferencesPgComponent,
    DecoratedIdsPgComponent,
    ExternalIdsPgComponent,
    FlagsPickerPgComponent,
    CodLocationPgComponent,
    DecoratedCountsPgComponent,
    HistoricalDatePgComponent,
    ImgAnnotatorPgComponent,
    ImgGalleryPgComponent,
    NoteSetPgComponent,
    PhysicalSizePgComponent,
    ProperNamePgComponent,
    RefLookupPgComponent,
    RefLookupDummyOptComponent,
    SdImgAnnotatorPgComponent,
    TextBlockViewPgComponent,
    ViafRefLookupPgComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      [
        { path: 'home', component: HomeComponent },
        { path: 'img/gallery', component: ImgGalleryPgComponent },
        { path: 'img/annotator', component: ImgAnnotatorPgComponent },
        { path: 'img/sd-annotator', component: SdImgAnnotatorPgComponent },
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
        { path: 'refs/viaf-lookup', component: ViafRefLookupPgComponent },
        { path: 'ui/flags-picker', component: FlagsPickerPgComponent },
        { path: 'ui/note-set', component: NoteSetPgComponent },
        { path: 'text/text-block-view', component: TextBlockViewPgComponent },
        { path: 'mat/physical-size', component: PhysicalSizePgComponent },
        { path: 'cod/location', component: CodLocationPgComponent },
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: '**', component: HomeComponent },
      ],
      {
        initialNavigation: 'enabledBlocking',
        useHash: true,
      }
    ),
    // material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
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
    CadmusSdimgAnnotatorModule,
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
    CadmusUiFlagsPickerModule,
    CadmusUiNoteSetModule,
  ],
  providers: [
    // index lookup definitions
    {
      provide: 'indexLookupDefinitions',
      useValue: INDEX_LOOKUP_DEFINITIONS,
    },
    {
      provide: ItemService,
      useClass: MockItemService,
    },
    // image gallery
    {
      provide: IMAGE_GALLERY_SERVICE_KEY,
      useClass: MockGalleryService,
    },
    {
      provide: IMAGE_GALLERY_OPTIONS_KEY,
      useValue: {
        baseUri: '',
        count: 50,
        width: 300,
        height: 400
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
