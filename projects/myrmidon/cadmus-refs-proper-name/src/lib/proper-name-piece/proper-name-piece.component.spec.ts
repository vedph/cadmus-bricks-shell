import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProperNamePieceComponent } from './proper-name-piece.component';

describe('ProperNamePieceComponent', () => {
  let component: ProperNamePieceComponent;
  let fixture: ComponentFixture<ProperNamePieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProperNamePieceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProperNamePieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
