import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { NgToolsModule } from '@myrmidon/ng-tools';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusRefsAssertionModule } from '@myrmidon/cadmus-refs-assertion';
import { CadmusRefsDocReferencesModule } from '@myrmidon/cadmus-refs-doc-references';
import { CadmusRefsLookupModule } from '@myrmidon/cadmus-refs-lookup';

import { AssertedIdComponent } from './asserted-id/asserted-id.component';
import { AssertedIdsComponent } from './asserted-ids/asserted-ids.component';
import { AssertedCompositeIdComponent } from './asserted-composite-id/asserted-composite-id.component';
import { AssertedCompositeIdsComponent } from './asserted-composite-ids/asserted-composite-ids.component';
import { PinTargetLookupComponent } from './pin-target-lookup/pin-target-lookup.component';
import { ScopedPinLookupComponent } from './scoped-pin-lookup/scoped-pin-lookup.component';

@NgModule({
  declarations: [
    AssertedIdComponent,
    AssertedIdsComponent,
    AssertedCompositeIdComponent,
    AssertedCompositeIdsComponent,
    PinTargetLookupComponent,
    ScopedPinLookupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    ClipboardModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    // Myrmidon
    NgToolsModule,
    // Cadmus
    CadmusCoreModule,
    CadmusRefsDocReferencesModule,
    CadmusRefsAssertionModule,
    CadmusRefsLookupModule,
    CadmusApiModule,
  ],
  exports: [
    AssertedIdComponent,
    AssertedIdsComponent,
    AssertedCompositeIdComponent,
    AssertedCompositeIdsComponent,
    PinTargetLookupComponent,
    ScopedPinLookupComponent,
  ],
})
export class CadmusRefsAssertedIdsModule {}
