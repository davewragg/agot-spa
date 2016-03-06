import {Component, Input} from 'angular2/core';
import {DeckClass} from '../models/deck-class.model';

@Component({
  selector: 'agot-deck-class-block',
  moduleId: module.id,
  template: `
    <div class="text-xs-center">
      <div class="card-header">{{ title }}</div>
      <img class="card-img" src="/assets/img/icon{{ deckClass.faction.factionId }}.png"
         alt="{{ deckClass.faction.factionName }}">
      <div class="card-footer text-muted small">{{ deckClass.title }}</div>
    </div>
    <!--<img *ngIf="deckClass.agenda" class="faction-badge" src="/assets/img/icon{{ deckClass.agenda.agendaId }}.png"-->
         <!--alt="{{ deckClass.agenda.title }}">-->
  `,
  styles: [``]
})
export class DeckClassBlockComponent {
  @Input()
  title:string;
  @Input()
  deckClass:DeckClass;
}
