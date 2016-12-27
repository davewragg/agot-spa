import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../shared/models/player.model';
import { PlayerInsights } from '../shared/models/player-insights.model';
import { DeckClassBlockComponent } from '../shared/components/deck-class-block.component';

@Component({
  selector: 'agot-player-insights',
  templateUrl: 'players/player-insights.html',
  directives: [DeckClassBlockComponent]
})
export class PlayerInsightsComponent implements OnInit {
  @Input()
  player: Player;
  @Input()
  playerInsights: PlayerInsights;

  ngOnInit() {
    //?
  }
}
