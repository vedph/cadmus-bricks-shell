import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

// refs bricks
import { CadmusRefsDocReferencesModule } from 'projects/myrmidon/cadmus-refs-doc-references/src/public-api';
import { CadmusRefsDecoratedIdsModule } from 'projects/myrmidon/cadmus-refs-decorated-ids/src/public-api';
import { CadmusRefsExternalIdsModule } from 'projects/myrmidon/cadmus-refs-external-ids/src/public-api';
import { CadmusRefsProperNameModule } from 'projects/myrmidon/cadmus-refs-proper-name/src/public-api';
import { CadmusRefsAssertionModule } from 'projects/myrmidon/cadmus-refs-assertion/src/public-api';
import { CadmusRefsChronotopeModule } from 'projects/myrmidon/cadmus-refs-chronotope/src/public-api';
import { CadmusRefsHistoricalDateModule } from 'projects/myrmidon/cadmus-refs-historical-date/src/public-api';
import { CadmusRefsAssertedIdModule } from 'projects/myrmidon/cadmus-refs-asserted-id/src/public-api';
import { CadmusUiFlagsPickerModule } from 'projects/myrmidon/cadmus-ui-flags-picker/src/public-api';
import { CadmusRefsLookupModule } from 'projects/myrmidon/cadmus-refs-lookup/src/public-api';

import { DocReferencesPgComponent } from './refs/doc-references-pg/doc-references-pg.component';
import { DecoratedIdsPgComponent } from './refs/decorated-ids-pg/decorated-ids-pg.component';
import { ExternalIdsPgComponent } from './refs/external-ids-pg/external-ids-pg.component';
import { ProperNamePgComponent } from './refs/proper-name-pg/proper-name-pg.component';
import { AssertionPgComponent } from './refs/assertion-pg/assertion-pg.component';
import { AssertedIdPgComponent } from './refs/asserted-id-pg/asserted-id-pg.component';
import { ChronotopePgComponent } from './refs/chronotope-pg/chronotope-pg.component';
import { HistoricalDatePgComponent } from './refs/historical-date-pg/historical-date-pg.component';
import { RefLookupPgComponent } from './refs/ref-lookup-pg/ref-lookup-pg.component';
import { FlagsPickerPgComponent } from './ui/flags-picker-pg/flags-picker-pg.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProperNamePgComponent,
    DocReferencesPgComponent,
    DecoratedIdsPgComponent,
    ExternalIdsPgComponent,
    AssertionPgComponent,
    AssertedIdPgComponent,
    ChronotopePgComponent,
    HistoricalDatePgComponent,
    FlagsPickerPgComponent,
    RefLookupPgComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
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
        { path: 'refs/historical-date', component: HistoricalDatePgComponent },
        { path: 'refs/lookup', component: RefLookupPgComponent },
        { path: 'ui/flags-picker', component: FlagsPickerPgComponent },
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
    // Cadmus
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusRefsDocReferencesModule,
    CadmusRefsDecoratedIdsModule,
    CadmusRefsExternalIdsModule,
    CadmusRefsProperNameModule,
    CadmusRefsAssertionModule,
    CadmusRefsAssertedIdModule,
    CadmusRefsChronotopeModule,
    CadmusRefsHistoricalDateModule,
    CadmusRefsLookupModule,
    CadmusUiFlagsPickerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
