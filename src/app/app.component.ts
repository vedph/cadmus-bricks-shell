import { Component } from '@angular/core';
import { EnvService } from '@myrmidon/ng-tools';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public version: string;

  constructor(env: EnvService) {
    this.version = env.get('version') || '';
  }
}
