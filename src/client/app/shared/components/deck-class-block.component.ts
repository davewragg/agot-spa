import { Component, Input } from '@angular/core';
import { DeckClass } from '../models/deck-class.model';
import { Stats } from '../models/stats.model';

@Component({
  moduleId: module.id,
  selector: 'agot-deck-class-block',
  template: `
    <div *ngIf="deckClass" class="text-xs-center deck-class-block"
    [style.backgroundImage]="deckClass.agenda?.agendaId && ('url(./assets/img/agenda' + deckClass.agenda?.agendaId + '.png)')">
      <div class="card-header {{ headerClass }}">{{ title }}</div>
      <img class="card-img" src="./assets/img/icon{{ deckClass.faction.factionId }}.png"
         alt="{{ deckClass.faction.name }}">
      <div class="card-footer text-muted small">
        {{ deckClass.title || deckClass.name }}
        <p *ngIf="stats">
          P{{ stats.played }}
          W{{ stats.won }}
          D{{ stats.drawn }}
          L{{ stats.lost }}
          W%{{ stats.winPercentage }}
        </p>
        <p *ngIf="footerText">{{ footerText }}</p>
      </div>
    </div>
  `,
  styles: [`
    .deck-class-block {
      background-repeat: no-repeat;
      background-position: top center;
      background-size: cover;
    }
  `]
})
export class DeckClassBlockComponent {
  @Input()
  title: string;
  @Input()
  footerText: string = '';
  @Input()
  headerClass: string;
  @Input()
  deckClass: DeckClass;
  @Input()
  stats: Stats;
}
