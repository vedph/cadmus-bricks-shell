import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEdPgComponent } from './text-ed-pg.component';

describe('TextEdPgComponent', () => {
  let component: TextEdPgComponent;
  let fixture: ComponentFixture<TextEdPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextEdPgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextEdPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
