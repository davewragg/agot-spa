import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { isEmpty } from 'lodash';
import { GameService } from '../shared/services/game.service';
import { Game } from '../shared/models/game.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';

@Component({
  moduleId: module.id,
  selector: 'agot-games',
  templateUrl: 'games.component.html',
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
    this._route.params
      .map(this.setInitialFiltering.bind(this))
      .do(() => this.isLoading = true)
      .switchMap((criteria: FilterCriteria) => this._gameService.getGames(criteria))
      .subscribe(
        (games: Game[]) => {
          this.loadingError = null;
          this.games = games;
          // TODO until loading states are sorted out
          this.isLoading = false;
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
    this._router.navigate(['/games', FilterCriteria.serialise(criteria)]);
  }

  private setInitialFiltering(params: Params) {
    const defaultFilter = this.initialFiltering || new FilterCriteria();
    return this.initialFiltering = isEmpty(params) ?
      defaultFilter :
      Object.assign(defaultFilter, FilterCriteria.deserialise(params));
  }
}
