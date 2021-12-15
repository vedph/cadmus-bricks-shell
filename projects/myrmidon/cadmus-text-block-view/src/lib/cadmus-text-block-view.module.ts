import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgToolsModule } from '@myrmidon/ng-tools';

import { TextBlockViewComponent } from './components/text-block-view/text-block-view.component';
import { ArrayIntersectPipe } from './pipes/array-intersect.pipe';

@NgModule({
  declarations: [TextBlockViewComponent, ArrayIntersectPipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgToolsModule],
  exports: [TextBlockViewComponent, ArrayIntersectPipe],
})
export class CadmusTextBlockViewModule {}
