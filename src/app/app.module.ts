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

// prosopa bricks
import { CadmusProsopaPersonNameModule } from 'projects/myrmidon/cadmus-prosopa-person-name/src/public-api';
import { PersonNamePgComponent } from './prosopa/person-name-pg/person-name-pg.component';
// refs bricks
import { CadmusRefsDocReferencesModule } from 'projects/myrmidon/cadmus-refs-doc-references/src/public-api';
import { CadmusRefsDecoratedIdsModule } from 'projects/myrmidon/cadmus-refs-decorated-ids/src/public-api';
import { DocReferencesPgComponent } from './refs/doc-references-pg/doc-references-pg.component';
import { DecoratedIdsPgComponent } from './refs/decorated-ids-pg/decorated-ids-pg.component';
import { CitedPersonPgComponent } from './prosopa/cited-person-pg/cited-person-pg.component';
import { CadmusProsopaCitedPersonModule } from 'projects/myrmidon/cadmus-prosopa-cited-person/src/public-api';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PersonNamePgComponent,
    DocReferencesPgComponent,
    DecoratedIdsPgComponent,
    CitedPersonPgComponent,
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
        { path: 'prosopa/person-name', component: PersonNamePgComponent },
        { path: 'prosopa/cited-person', component: CitedPersonPgComponent },
        { path: 'refs/doc-references', component: DocReferencesPgComponent },
        { path: 'refs/decorated-ids', component: DecoratedIdsPgComponent },
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
    CadmusProsopaPersonNameModule,
    CadmusProsopaCitedPersonModule,
    CadmusRefsDocReferencesModule,
    CadmusRefsDecoratedIdsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
