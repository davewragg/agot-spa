import {Component, OnInit} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {PlayerService} from '../shared/services/player.service';
import {Player} from '../shared/models/player.model';
import {PlayerStats} from '../shared/models/player-stats.model';
import {PlayerStatsComponent} from './player-stats.component';
import {FilterCriteria} from '../shared/models/filter-criteria.model';
import {DateRangeType} from '../shared/models/date-range-type.model';
import {DateRangeComponent} from '../home/components/date-range.component';
import {SpinnerComponent} from '../shared/components/spinner.component';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'agot-player-details',
  moduleId: module.id,
  viewProviders: [PlayerService],
  templateUrl: './player-details.html',
  directives: [ROUTER_DIRECTIVES, PlayerStatsComponent, DateRangeComponent, SpinnerComponent]
})
export class PlayerDetailsComponent implements OnInit {
  player:Player;
  playerStats:PlayerStats;
  playerIdParam:number;

  isLoading:boolean;

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
      this.loadPlayerAndStats(this.defaultFiltering);
    }
  }

  onDateRangeChange(criteria:FilterCriteria) {
    this.loadPlayerAndStats(criteria);
  }

  private loadPlayerAndStats(criteria?:FilterCriteria) {
    this.isLoading = true;
    Observable.combineLatest(
      this._playerService.getPlayer(this.playerIdParam),
      this._playerService.getPlayerStats(this.playerIdParam, criteria)
    ).subscribe(
      ([player, stats]:[Player, PlayerStats]) => {
        console.log(player, stats);
        this.player = player;
        this.playerStats = stats;
        // .combineLatest may not trigger done()
        this.stopLoading();
      },
      (error) => {
        console.error(error);
        this.stopLoading();
      },
      () => this.stopLoading());
  }

  private stopLoading() {
    console.log('done loadstats');
    this.isLoading = false;
  }
}
