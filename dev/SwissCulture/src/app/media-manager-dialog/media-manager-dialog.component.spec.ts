import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaManagerDialogComponent } from './media-manager-dialog.component';

describe('MediaManagerDialogComponent', () => {
  let component: MediaManagerDialogComponent;
  let fixture: ComponentFixture<MediaManagerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaManagerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaManagerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
