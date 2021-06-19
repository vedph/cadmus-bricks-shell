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

@NgModule({
  declarations: [AppComponent, HomeComponent, PersonNamePgComponent],
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
    CadmusProsopaPersonNameModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
