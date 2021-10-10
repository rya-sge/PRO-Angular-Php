import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitModifDialogComponent } from './visit-modif-dialog.component';

describe('VisitModifDialogComponent', () => {
  let component: VisitModifDialogComponent;
  let fixture: ComponentFixture<VisitModifDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitModifDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitModifDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
