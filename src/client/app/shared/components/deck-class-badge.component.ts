import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DeckClass } from '../models/deck-class.model';

@Component({
  moduleId: module.id,
  selector: 'agot-deck-class-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img class="faction-badge" src="./assets/img/icon{{ deckClass.faction.factionId }}.png"
         alt="{{ deckClass.faction.name }}">
    <img *ngIf="deckClass.agenda" class="faction-badge" src="./assets/img/agenda{{ deckClass.agenda.agendaId }}.png"
         alt="{{ deckClass.agenda.title }}">
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
  deckClass: DeckClass;

  getName(deckClass: DeckClass) {
    return DeckClass.getName(deckClass);
  }
}
