import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitCreationComponent } from './visit-creation.component';

describe('VisiteCreationComponent', () => {
  let component: VisitCreationComponent;
  let fixture: ComponentFixture<VisitCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
