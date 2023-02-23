import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdImgAnnotatorPgComponent } from './sd-img-annotator-pg.component';

describe('SdImgAnnotatorPgComponent', () => {
  let component: SdImgAnnotatorPgComponent;
  let fixture: ComponentFixture<SdImgAnnotatorPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdImgAnnotatorPgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdImgAnnotatorPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
