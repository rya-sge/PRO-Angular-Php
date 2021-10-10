import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitListPublicComponent } from './visit-list-public.component';

describe('VisitListPublicComponent', () => {
  let component: VisitListPublicComponent;
  let fixture: ComponentFixture<VisitListPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitListPublicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitListPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
