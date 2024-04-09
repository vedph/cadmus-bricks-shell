import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiImeComponent } from './emoji-ime.component';

describe('EmojiImeComponent', () => {
  let component: EmojiImeComponent;
  let fixture: ComponentFixture<EmojiImeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmojiImeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmojiImeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
