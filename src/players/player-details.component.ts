import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {PlayerService} from '../shared/services/player.service';
import {Player} from '../shared/models/player.model';
import {PlayerStats} from '../shared/models/player-stats.model';
import {PlayerStatsComponent} from './player-stats.component';
import {FilterCriteria} from '../shared/models/filter-criteria.model';
import {DateRangeType} from '../shared/models/date-range-type.model';
import {DateRangeComponent} from '../home/components/date-range.component';
import {SpinnerComponent} from '../shared/components/spinner.component';
import {Observable} from 'rxjs/Observable';
import {StatsService} from '../shared/services/stats.service';

@Component({
  selector: 'agot-player-details',
  moduleId: module.id,
  templateUrl: './player-details.html',
  directives: [ROUTER_DIRECTIVES, PlayerStatsComponent, DateRangeComponent, SpinnerComponent]
})
export class PlayerDetailsComponent implements OnInit {
  player:Player;
  playerStats:PlayerStats;
  playerIdParam:number;

  isLoading:boolean;

  initialFiltering:FilterCriteria;

  constructor(params:RouteParams,
              private _router:Router,
              private _statsService:StatsService,
              private _playerService:PlayerService) {
    this.playerIdParam = <number>+params.get('id');
    this.setInitialFiltering(params);
  }

  ngOnInit() {
    if (this.playerIdParam) {
      this.loadPlayerAndStats(this.initialFiltering);
    }
  }

  onDateRangeChange(criteria:FilterCriteria) {
    //this.loadPlayerAndStats(criteria);
    this._router.navigate(['PlayerDetails', FilterCriteria.serialise(criteria)]);
  }

  private loadPlayerAndStats(criteria?:FilterCriteria) {
    this.isLoading = true;
    Observable.combineLatest(
      this._playerService.getPlayer(this.playerIdParam),
      this._statsService.getPlayerStats(this.playerIdParam, criteria)
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

  private setInitialFiltering(params:RouteParams) {
    // TODO use proper constructor to aid caching
    this.initialFiltering = Object.assign(<FilterCriteria>{
      ascending: true,
      rangeSelection: DateRangeType.ALL_TIME
    }, FilterCriteria.deserialise(params));
  }
}
