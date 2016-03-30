import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {CountComponent} from '../shared/components/count.component';
import {GamesTableComponent} from '../home/components/games-table.component';
import {DeckStats} from '../shared/models/deck-stats.model';
import {PlayerStatsTableComponent} from '../players/player-stats-table.component';
import {Deck} from '../shared/models/deck.model';

@Component({
  selector: 'agot-deck-stats',
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deck-stats.component.html',
  directives: [CountComponent, PlayerStatsTableComponent, GamesTableComponent]
})
export class DeckStatsComponent {
  @Input()
  deck:Deck;
  @Input()
  deckStats:DeckStats;

  showGames:boolean = false;
}
