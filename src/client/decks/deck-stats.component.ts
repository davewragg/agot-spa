import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {CountComponent} from '../shared/components/count.component';
import {GamesTableComponent} from '../home/components/games-table.component';
import {DeckStats} from '../shared/models/deck-stats.model';
import {StatsTableComponent} from '../players/stats-table.component';
import {Deck} from '../shared/models/deck.model';
import {PlayedStatsChartComponent} from '../shared/components/played-stats-chart';
import {GameTimelineChartComponent} from '../shared/components/game-timeline-chart';

@Component({
  selector: 'agot-deck-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'decks/deck-stats.component.html',
  directives: [CountComponent, StatsTableComponent, GamesTableComponent, PlayedStatsChartComponent, GameTimelineChartComponent]
})
export class DeckStatsComponent {
  @Input()
  deck:Deck;
  @Input()
  deckStats:DeckStats;

  showGames:boolean = false;
}
