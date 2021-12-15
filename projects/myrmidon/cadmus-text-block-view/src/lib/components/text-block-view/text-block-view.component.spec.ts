import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBlockViewComponent } from './text-block-view.component';

describe('TextBlockViewComponent', () => {
  let component: TextBlockViewComponent;
  let fixture: ComponentFixture<TextBlockViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextBlockViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextBlockViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
