import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteSetPgComponent } from './note-set-pg.component';

describe('NoteSetPgComponent', () => {
  let component: NoteSetPgComponent;
  let fixture: ComponentFixture<NoteSetPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteSetPgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteSetPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
