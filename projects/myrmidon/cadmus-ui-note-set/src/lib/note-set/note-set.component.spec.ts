import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteSetComponent } from './note-set.component';

describe('NoteSetComponent', () => {
  let component: NoteSetComponent;
  let fixture: ComponentFixture<NoteSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
