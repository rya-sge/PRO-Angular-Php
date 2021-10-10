/**
 * Date de création :  30 mai
 * Dernier contributeur : Ryan Sauge
 * Groupe : PRO-A-07
 * Description :
 * Dialogue pour afficher les informations d'une visite
 */
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-visite-image-dialogue',
  templateUrl: './visite-image-dialogue.component.html',
  styleUrls: ['./visite-image-dialogue.component.scss']
})
export class VisiteImageDialogueComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    description: string
    auteur: string
    title: string
  }) { }

  ngOnInit(): void {
  }

}
