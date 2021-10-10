import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInstitutionComponent } from './list-institution.component';

describe('ListInstitutionComponent', () => {
  let component: ListInstitutionComponent;
  let fixture: ComponentFixture<ListInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInstitutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
