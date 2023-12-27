import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbpediaRefLookupPgComponent } from './dbpedia-ref-lookup-pg.component';

describe('DbpediaRefLookupPgComponent', () => {
  let component: DbpediaRefLookupPgComponent;
  let fixture: ComponentFixture<DbpediaRefLookupPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbpediaRefLookupPgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DbpediaRefLookupPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
