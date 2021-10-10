import {City} from './City';

export class Institution  {
  id: number;
  description: string;
  nom: string;
  url: string;
  rue: string;
  ville: City;
  domaine: string;
}

export function cityToString(address: string, city: City): string {
  return address + ', ' + city.npa + ' ' + city.nom;
}
