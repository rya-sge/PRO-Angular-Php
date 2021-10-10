/**
 * Date de création     : 27.03.2021
 * Dernier contributeur : Dylan Canton
 * Groupe               : PRO-A-07
 * Description          : Fichier spec.ts du composant d'upload d'image
 * Remarque             : -
 * Sources              : -
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImgComponent } from './upload-img.component';

describe('UploadImgComponent', () => {
  let component: UploadImgComponent;
  let fixture: ComponentFixture<UploadImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
