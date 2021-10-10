import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitModifComponent } from './visit-modif.component';

describe('VisitModifComponent', () => {
  let component: VisitModifComponent;
  let fixture: ComponentFixture<VisitModifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitModifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitModifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
