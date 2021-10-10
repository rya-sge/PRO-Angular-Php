import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteImageDialogueComponent } from './visite-image-dialogue.component';

describe('VisiteImageDialogueComponent', () => {
  let component: VisiteImageDialogueComponent;
  let fixture: ComponentFixture<VisiteImageDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisiteImageDialogueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteImageDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
