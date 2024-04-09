import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { EmojiService, UnicodeEmoji } from '../emoji.service';

export interface EmojiImeComponentData {
  name?: string;
  size?: number;
  autoPick?: boolean;
}

@Component({
  selector: 'cadmus-emoji-ime',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
  ],
  templateUrl: './emoji-ime.component.html',
  styleUrl: './emoji-ime.component.css',
})
export class EmojiImeComponent implements OnInit, AfterViewInit, OnDestroy {
  private _sub?: Subscription;

  @ViewChild('nameInput')
  public inputCtl?: ElementRef;

  public name: FormControl<string | null>;
  public form: FormGroup;

  public emojis: UnicodeEmoji[] = [];
  public inDialog = false;

  @Input()
  public size = 32;

  @Input()
  public autoPick = false;

  @Output()
  public emojiPick: EventEmitter<UnicodeEmoji> =
    new EventEmitter<UnicodeEmoji>();

  @Output()
  public closeRequest: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _emojiService: EmojiService,
    formBuilder: FormBuilder,
    @Optional()
    public dialogRef?: MatDialogRef<EmojiImeComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data?: EmojiImeComponentData
  ) {
    this.name = formBuilder.control(data?.name || null);
    this.form = formBuilder.group({
      name: this.name,
    });

    if (data?.size) {
      this.size = data.size;
    }
    if (data?.autoPick) {
      this.autoPick = data.autoPick;
    }
    this.inDialog = !!dialogRef;
  }

  private lookupEmoji(): void {
    if (this.name.value) {
      this.emojis = this._emojiService.lookupEmoji(this.name.value);
      if (this.autoPick && this.emojis.length === 1) {
        this.pickEmoji(this.emojis[0]);
      }
    }
  }

  public ngOnInit(): void {
    this.lookupEmoji();

    this._sub = this.name.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(300))
      .subscribe((_) => {
        this.lookupEmoji();
      });
  }

  public ngAfterViewInit(): void {
    if (this.inputCtl) {
      setTimeout(() => {
        this.inputCtl!.nativeElement.focus();
        if (this.name.value) {
          this.inputCtl!.nativeElement.select();
        }
      });
    }
  }

  public ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  public close(): void {
    this.closeRequest.emit();
    this.dialogRef?.close();
  }

  public pickEmoji(emoji?: UnicodeEmoji): void {
    if (!emoji) {
      return;
    }
    this.emojiPick.emit(emoji);
    this.dialogRef?.close(emoji);
  }
}
