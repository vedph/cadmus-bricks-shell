import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DatationComponent } from './datation.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { HAMMER_LOADER } from '@angular/platform-browser';

describe('DatationEditorComponent', () => {
  let component: DatationComponent;
  let fixture: ComponentFixture<DatationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        CadmusMaterialModule,
      ],
      // https://github.com/angular/components/issues/14668
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {}),
        },
      ],
      declarations: [DatationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
