import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { isEmpty } from 'lodash';
import { GameService } from '../shared/services/game.service';
import { Game } from '../shared/models/game.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
// import { GamesTableComponent } from './games-table.component';
// import { DateRangeComponent } from './date-range.component';
// import { SpinnerComponent } from '../../shared/components/spinner.component';
// import { GameTimelineChartComponent } from '../../shared/components/game-timeline-chart';

@Component({
  moduleId: module.id,
  selector: 'agot-games',
  templateUrl: 'games.component.html',
  // directives: [GamesTableComponent, DateRangeComponent, SpinnerComponent, GameTimelineChartComponent]
})
export class GamesComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  initialFiltering: FilterCriteria;
  @Input()
  hideFilters: boolean = false;

  games: Game[];
  loadingError: any = null;
  isLoading: boolean;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _gameService: GameService) {

  }

  ngOnInit() {
    // this.setInitialFiltering(params);
    // this.loadGames(this.initialFiltering);
    this._route.params
      .map(this.setInitialFiltering.bind(this))
      .do(() => this.isLoading = true)
      .switchMap((criteria: FilterCriteria) => this._gameService.getGames(criteria))
      .subscribe(
        (games: Game[]) => {
          this.loadingError = null;
          this.games = games;
        },
        (err) => {
          this.loadingError = err._body || err.message || err;
          this.isLoading = false;
        },
        () => {
          console.log('done');
          this.isLoading = false;
        }
      );
  }

  onDateRangeChange(criteria: FilterCriteria) {
    this.loadGames(criteria);
  }

  loadGames(criteria?: FilterCriteria) {
    this._router.navigate(['Games', FilterCriteria.serialise(criteria)]);
  }

  private setInitialFiltering(params: Params) {
    const defaultFilter = this.initialFiltering || {};
    return isEmpty(params) ?
      defaultFilter :
      Object.assign(defaultFilter, FilterCriteria.deserialise(params));
  }
}
