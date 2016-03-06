import {Component, OnInit, Input} from 'angular2/core';
import {Player} from '../shared/models/player.model';
import {PlayerInsights} from '../shared/models/player-insights.model';

@Component({
  selector: 'agot-player-insights',
  moduleId: module.id,
  templateUrl: './player-insights.html',
  directives: []
})
export class PlayerInsightsComponent implements OnInit {
  @Input()
  player:Player;
  @Input()
  playerInsights:PlayerInsights;

  ngOnInit() {
    //?
  }
}
