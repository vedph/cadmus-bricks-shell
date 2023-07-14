import { Component } from '@angular/core';

@Component({
  selector: 'app-img-annotator-toolbar-pg',
  templateUrl: './img-annotator-toolbar-pg.component.html',
  styleUrls: ['./img-annotator-toolbar-pg.component.css'],
})
export class ImgAnnotatorToolbarPgComponent {
  public tool?: string;

  public onToolChange(tool: string): void {
    this.tool = tool;
  }
}
