import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgAnnotatorPgComponent } from './img-annotator-pg.component';

describe('ImgAnnotatorPgComponent', () => {
  let component: ImgAnnotatorPgComponent;
  let fixture: ComponentFixture<ImgAnnotatorPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgAnnotatorPgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgAnnotatorPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
