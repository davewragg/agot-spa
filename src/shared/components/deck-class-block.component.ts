import {Component, Input} from 'angular2/core';
import {DeckClass} from '../models/deck-class.model';

@Component({
  selector: 'agot-deck-class-block',
  moduleId: module.id,
  template: `
    <div *ngIf="deckClass" class="text-xs-center deck-class-block"
         style="background-image: url(/assets/img/icon{{ deckClass.agenda?.agendaId }}.png)">
      <div class="card-header {{ headerClass }}">{{ title }}</div>
      <img class="card-img" src="/assets/img/icon{{ deckClass.faction.factionId }}.png"
         alt="{{ deckClass.faction.factionName }}">
      <div class="card-footer text-muted small">{{ deckClass.title }}</div>
    </div>
  `,
  styles: [`
    .deck-class-block {
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
    }
  `]
})
export class DeckClassBlockComponent {
  @Input()
  title:string;
  @Input()
  headerClass:string;
  @Input()
  deckClass:DeckClass;
}
