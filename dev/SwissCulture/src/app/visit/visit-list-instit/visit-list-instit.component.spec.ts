import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitListInstitComponent } from './visit-list-instit.component';

describe('VisitListComponent', () => {
  let component: VisitListInstitComponent;
  let fixture: ComponentFixture<VisitListInstitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitListInstitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitListInstitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
