import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  MdBoldCtePlugin,
  MdItalicCtePlugin,
  MdEmojiCtePlugin,
} from 'projects/myrmidon/cadmus-text-ed-md/src/public-api';
import {
  CadmusTextEdResult,
  CadmusTextEdService,
} from 'projects/myrmidon/cadmus-text-ed/src/public-api';

@Component({
  selector: 'app-text-ed-pg',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './text-ed-pg.component.html',
  styleUrl: './text-ed-pg.component.css',
})
export class TextEdPgComponent {
  public selector: FormControl<string>;
  public text: FormControl<string>;
  public form: FormGroup;
  public result?: CadmusTextEdResult;

  constructor(
    formBuilder: FormBuilder,
    private _editService: CadmusTextEdService
  ) {
    this.selector = formBuilder.control('', {
      nonNullable: true,
      validators: Validators.required,
    });
    this.text = formBuilder.control('', {
      nonNullable: true,
      validators: Validators.required,
    });
    this.form = formBuilder.group({
      selector: this.selector,
      text: this.text,
    });

    // configure plugins for this service instance
    this._editService.configure({
      plugins: [
        inject(MdBoldCtePlugin),
        inject(MdItalicCtePlugin),
        inject(MdEmojiCtePlugin),
      ],
    });
  }

  public async edit() {
    if (this.form.invalid) {
      return;
    }
    this.result = await this._editService.edit({
      selector: this.selector.value,
      text: this.text.value,
    });
  }
}
