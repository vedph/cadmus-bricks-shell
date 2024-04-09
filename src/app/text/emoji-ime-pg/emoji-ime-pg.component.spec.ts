import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiImePgComponent } from './emoji-ime-pg.component';

describe('EmojiImePgComponent', () => {
  let component: EmojiImePgComponent;
  let fixture: ComponentFixture<EmojiImePgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmojiImePgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmojiImePgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
