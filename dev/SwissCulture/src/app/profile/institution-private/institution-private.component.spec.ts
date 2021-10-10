import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionPrivateComponent } from './institution-private.component';

describe('InstitutionPriveComponent', () => {
  let component: InstitutionPrivateComponent;
  let fixture: ComponentFixture<InstitutionPrivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionPrivateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionPrivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
