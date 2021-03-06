import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { isEmpty } from 'lodash';
import { PlayerService } from '../shared/services/player.service';
import { StatsService } from '../shared/services/stats.service';
import { Player } from '../shared/models/player.model';
import { PlayerStats } from '../shared/models/player-stats.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import { DateRangeType } from '../shared/models/date-range-type.model';

@Component({
  moduleId: module.id,
  selector: 'agot-player-details',
  templateUrl: 'player-details.component.html',
})
export class PlayerDetailsComponent implements OnInit {
  player: Player;
  playerIdParam: number;
  playerStats: PlayerStats;

  isLoading: boolean;

  criteria: FilterCriteria;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _statsService: StatsService,
              private _playerService: PlayerService) {
  }

  ngOnInit() {
    this._route.params
      .do((params: Params) => this.playerIdParam = +params['id'])
      .map(this.setFiltering.bind(this))
      .do(() => this.isLoading = true)
      .switchMap((criteria: FilterCriteria) =>
        Observable.combineLatest(
          this._playerService.getPlayer(this.playerIdParam),
          this._statsService.getPlayerStats(this.playerIdParam, criteria)
        )).subscribe(
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

  onDateRangeChange(criteria: FilterCriteria) {
    this.loadPlayerAndStats(criteria);
  }

  private loadPlayerAndStats(criteria?: FilterCriteria) {
    this._router.navigate(['/players/', this.playerIdParam, FilterCriteria.serialise(criteria)]);
  }

  private stopLoading() {
    console.log('done loadstats');
    this.isLoading = false;
  }

  private setFiltering(params: Params) {
    const defaultFilter = Object.assign(new FilterCriteria(), {
      ascending: true,
      rangeSelection: DateRangeType.ALL_TIME
    });
    return this.criteria = isEmpty(params) ?
      defaultFilter :
      FilterCriteria.deserialise(params, defaultFilter);
  }
}
