import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
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
import { MatToolbarModule } from '@angular/material/toolbar';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

// refs bricks
import { CadmusMatPhysicalSizeModule } from 'projects/myrmidon/cadmus-mat-physical-size/src/public-api';
import { CadmusRefsAssertionModule } from 'projects/myrmidon/cadmus-refs-assertion/src/public-api';
import { CadmusRefsAssertedIdModule } from 'projects/myrmidon/cadmus-refs-asserted-id/src/public-api';
import { CadmusRefsAssertedChronotopeModule } from 'projects/myrmidon/cadmus-refs-asserted-chronotope/src/public-api';
import { CadmusRefsChronotopeModule } from 'projects/myrmidon/cadmus-refs-chronotope/src/public-api';
import { CadmusRefsDecoratedIdsModule } from 'projects/myrmidon/cadmus-refs-decorated-ids/src/public-api';
import { CadmusRefsDocReferencesModule } from 'projects/myrmidon/cadmus-refs-doc-references/src/public-api';
import { CadmusRefsExternalIdsModule } from 'projects/myrmidon/cadmus-refs-external-ids/src/public-api';
import { CadmusRefsHistoricalDateModule } from 'projects/myrmidon/cadmus-refs-historical-date/src/public-api';
import { CadmusRefsProperNameModule } from 'projects/myrmidon/cadmus-refs-proper-name/src/public-api';
import { CadmusUiFlagsPickerModule } from 'projects/myrmidon/cadmus-ui-flags-picker/src/public-api';
import { CadmusRefsLookupModule } from 'projects/myrmidon/cadmus-refs-lookup/src/public-api';
import { CadmusTextBlockViewModule } from 'projects/myrmidon/cadmus-text-block-view/src/public-api';
import { CadmusCodLocationModule } from 'projects/myrmidon/cadmus-cod-location/src/public-api';

import { AssertedChronotopePgComponent } from './refs/asserted-chronotope-pg/asserted-chronotope-pg.component';
import { AssertedChronotopeSetPgComponent } from './refs/asserted-chronotope-set-pg/asserted-chronotope-set-pg.component';
import { AssertedIdPgComponent } from './refs/asserted-id-pg/asserted-id-pg.component';
import { AssertionPgComponent } from './refs/assertion-pg/assertion-pg.component';
import { ChronotopePgComponent } from './refs/chronotope-pg/chronotope-pg.component';
import { CodLocationPgComponent } from './cod/cod-location-pg/cod-location-pg.component';
import { DecoratedIdsPgComponent } from './refs/decorated-ids-pg/decorated-ids-pg.component';
import { DocReferencesPgComponent } from './refs/doc-references-pg/doc-references-pg.component';
import { ExternalIdsPgComponent } from './refs/external-ids-pg/external-ids-pg.component';
import { HistoricalDatePgComponent } from './refs/historical-date-pg/historical-date-pg.component';
import { FlagsPickerPgComponent } from './ui/flags-picker-pg/flags-picker-pg.component';
import { ProperNamePgComponent } from './refs/proper-name-pg/proper-name-pg.component';
import { PhysicalSizePgComponent } from './mat/physical-size-pg/physical-size-pg.component';
import { RefLookupDummyOptComponent } from './refs/ref-lookup-dummy-opt/ref-lookup-dummy-opt.component';
import { RefLookupPgComponent } from './refs/ref-lookup-pg/ref-lookup-pg.component';
import { TextBlockViewPgComponent } from './text/text-block-view-pg/text-block-view-pg.component';
import { ViafRefLookupPgComponent } from './refs/viaf-ref-lookup-pg/viaf-ref-lookup-pg.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProperNamePgComponent,
    DocReferencesPgComponent,
    DecoratedIdsPgComponent,
    ExternalIdsPgComponent,
    AssertedChronotopePgComponent,
    AssertedChronotopeSetPgComponent,
    AssertionPgComponent,
    AssertedIdPgComponent,
    ChronotopePgComponent,
    HistoricalDatePgComponent,
    FlagsPickerPgComponent,
    RefLookupPgComponent,
    RefLookupDummyOptComponent,
    ViafRefLookupPgComponent,
    TextBlockViewPgComponent,
    PhysicalSizePgComponent,
    CodLocationPgComponent,
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
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'refs/doc-references', component: DocReferencesPgComponent },
        { path: 'refs/external-ids', component: ExternalIdsPgComponent },
        { path: 'refs/decorated-ids', component: DecoratedIdsPgComponent },
        { path: 'refs/proper-name', component: ProperNamePgComponent },
        { path: 'refs/assertion', component: AssertionPgComponent },
        { path: 'refs/asserted-id', component: AssertedIdPgComponent },
        { path: 'refs/chronotope', component: ChronotopePgComponent },
        { path: 'refs/asserted-chronotope', component: AssertedChronotopePgComponent },
        { path: 'refs/asserted-chronotope-set', component: AssertedChronotopeSetPgComponent },
        { path: 'refs/historical-date', component: HistoricalDatePgComponent },
        { path: 'refs/lookup', component: RefLookupPgComponent },
        { path: 'refs/viaf-lookup', component: ViafRefLookupPgComponent },
        { path: 'ui/flags-picker', component: FlagsPickerPgComponent },
        { path: 'text/text-block-view', component: TextBlockViewPgComponent },
        { path: 'mat/physical-size', component: PhysicalSizePgComponent },
        { path: 'cod/location', component: CodLocationPgComponent },
        { path: '**', component: HomeComponent },
      ],
      {
        initialNavigation: 'enabled',
        useHash: true,
        relativeLinkResolution: 'legacy',
      }
    ),
    // flex
    FlexLayoutModule,
    // material
    MatAutocompleteModule,
    MatButtonModule,
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
    MatToolbarModule,
    // Cadmus
    CadmusCoreModule,
    CadmusRefsDocReferencesModule,
    CadmusRefsDecoratedIdsModule,
    CadmusRefsExternalIdsModule,
    CadmusRefsProperNameModule,
    CadmusRefsAssertionModule,
    CadmusRefsAssertedIdModule,
    CadmusRefsChronotopeModule,
    CadmusRefsAssertedChronotopeModule,
    CadmusRefsHistoricalDateModule,
    CadmusRefsLookupModule,
    CadmusTextBlockViewModule,
    CadmusMatPhysicalSizeModule,
    CadmusCodLocationModule,
    CadmusUiFlagsPickerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
