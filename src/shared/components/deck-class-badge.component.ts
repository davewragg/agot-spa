import {Component, Input} from 'angular2/core';
import {DeckClass} from '../models/deck-class.model';

@Component({
  selector: 'agot-deck-class-badge',
  moduleId: module.id,
  template: `
    <img class="faction-badge" src="/assets/img/icon{{ deckClass.faction.factionId }}.png"
         alt="{{ deckClass.faction.factionName }}">
    <img *ngIf="deckClass.agenda" class="faction-badge" src="/assets/img/icon{{ deckClass.agenda.agendaId }}.png"
         alt="{{ deckClass.agenda.title }}">
    <span class="small">{{ deckClass.title }}</span>
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
}