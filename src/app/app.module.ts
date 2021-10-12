import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './home/home.component';

// refs bricks
import { CadmusRefsDocReferencesModule } from 'projects/myrmidon/cadmus-refs-doc-references/src/public-api';
import { CadmusRefsDecoratedIdsModule } from 'projects/myrmidon/cadmus-refs-decorated-ids/src/public-api';
import { CadmusRefsExternalIdsModule } from 'projects/myrmidon/cadmus-refs-external-ids/src/public-api';
import { CadmusRefsProperNameModule } from 'projects/myrmidon/cadmus-refs-proper-name/src/public-api';
import { CadmusRefsAssertionModule } from 'projects/myrmidon/cadmus-refs-assertion/src/public-api';

import { DocReferencesPgComponent } from './refs/doc-references-pg/doc-references-pg.component';
import { DecoratedIdsPgComponent } from './refs/decorated-ids-pg/decorated-ids-pg.component';
import { ExternalIdsPgComponent } from './refs/external-ids-pg/external-ids-pg.component';
import { ProperNamePgComponent } from './refs/proper-name-pg/proper-name-pg.component';
import { AssertionPgComponent } from './refs/assertion-pg/assertion-pg.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProperNamePgComponent,
    DocReferencesPgComponent,
    DecoratedIdsPgComponent,
    ExternalIdsPgComponent,
    AssertionPgComponent,
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
    CadmusRefsAssertionModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
