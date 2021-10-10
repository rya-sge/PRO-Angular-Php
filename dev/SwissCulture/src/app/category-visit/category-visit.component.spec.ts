import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryVisitComponent } from './category-visit.component';

describe('CategoryVisitComponent', () => {
  let component: CategoryVisitComponent;
  let fixture: ComponentFixture<CategoryVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryVisitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
