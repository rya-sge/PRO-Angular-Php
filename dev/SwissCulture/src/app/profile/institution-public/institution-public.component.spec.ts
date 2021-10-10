import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionPublicComponent } from './institution-public.component';

describe('InstitutionPublicComponent', () => {
  let component: InstitutionPublicComponent;
  let fixture: ComponentFixture<InstitutionPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionPublicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
