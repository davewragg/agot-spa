import {Component, Input} from 'angular2/core';
import {DeckClass} from '../models/deck-class.model';

@Component({
  selector: 'agot-deck-class-badge',
  template: `
    <img class="faction-badge" src="./assets/img/icon{{ deckClass.faction.factionId }}.png"
         alt="{{ deckClass.faction.name }}">
    <img *ngIf="deckClass.agenda" class="faction-badge" src="./assets/img/agenda{{ deckClass.agenda.agendaId }}.png"
         alt="{{ deckClass.agenda.title }}">
    <img *ngIf="deckClass.secondFaction" class="faction-badge" src="./assets/img/faction{{ deckClass.secondFaction.factionId }}.png"
         alt="{{ deckClass.secondFaction.title }}">
    <span class="small">{{ deckClass.name || getName(deckClass) }}</span>
  `,
  styles: [`
   .faction-badge {
      height: 2.0em;
   }
  `]
})
export class DeckClassBadgeComponent {
  @Input()
  deckClass:DeckClass;

  getName(deckClass:DeckClass) {
    return DeckClass.getName(deckClass);
  }
}
