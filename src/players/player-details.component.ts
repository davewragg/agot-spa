import {Component, OnInit} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {PlayerService} from '../shared/services/player.service';
import {Player} from '../shared/models/player.model';
import {PlayerStats} from '../shared/models/player-stats.model';
import {PlayerStatsComponent} from './player-stats.component';
import {FilterCriteria} from '../shared/models/filter-criteria.model';
import {DateRangeType} from '../shared/models/date-range-type.model';
import {DateRangeComponent} from '../home/components/date-range.component';

@Component({
  selector: 'agot-player-details',
  moduleId: module.id,
  viewProviders: [PlayerService],
  templateUrl: './player-details.html',
  //styleUrls: ['./player-details.css']
  directives: [ROUTER_DIRECTIVES, PlayerStatsComponent, DateRangeComponent]
})
export class PlayerDetailsComponent implements OnInit {
  player:Player;
  playerStats:PlayerStats;
  playerIdParam:number;

  defaultFiltering:FilterCriteria;

  constructor(params:RouteParams,
              private _playerService:PlayerService) {
    this.playerIdParam = <number>+params.get('id');
    this.defaultFiltering = <FilterCriteria>{
      ascending: true,
      rangeSelection: DateRangeType.ALL_TIME
    };
  }

  ngOnInit() {
    if (this.playerIdParam) {
      this.player = this._playerService.getPlayer(this.playerIdParam);
      this.loadStats(this.defaultFiltering);
    }
  }

  onDateRangeChange(criteria:FilterCriteria) {
    this.loadStats(criteria);
  }

  private loadStats(criteria?:FilterCriteria) {
    this._playerService.getPlayerStats(this.playerIdParam, criteria)
      .subscribe((stats) => {
        this.playerStats = stats;
      });
  };
}
