import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
// import { Params } from '@angular/router';
// import { isEmpty } from 'lodash';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { go } from '@ngrx/router-store';
import { Game } from '../shared/models/game.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import * as fromRoot from '../state-management/reducers/index';
// import * as gameActions from '../state-management/actions/game';

@Component({
  moduleId: module.id,
  selector: 'agot-games',
  templateUrl: 'games.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesComponent /*implements OnInit*/ {
  @Input()
  title: string;
  @Input()
  criteria: FilterCriteria;
  @Input()
  hideFilters: boolean = false;

  // games: Game[];
  // loadingError: any = null;
  isLoading: boolean;

  searchQuery$: Observable<FilterCriteria>;
  games$: Observable<Game[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.searchQuery$ = store.select(fromRoot.getSearchQuery).take(1);
    this.games$ = store.select(fromRoot.getSearchResults);
    this.loading$ = store.select(fromRoot.getSearchLoading);
  }

  // search(criteria: FilterCriteria) {
  //   this.store.dispatch(new gameActions.FilterAction(criteria));
  // }

  // constructor(private _route: ActivatedRoute,
  //             private _router: Router,
  //             private _gameService: GameService) {
  //
  // }

  // ngOnInit() {
  //   this._route.params
  //     .map(this.setFiltering.bind(this))
  //     .do(() => this.isLoading = true)
  //     .switchMap((criteria: FilterCriteria) => this._gameService.getGames(criteria))
  //     .subscribe(
  //       (games: Game[]) => {
  //         this.loadingError = null;
  //         this.games = games;
  //         // TODO until loading states are sorted out
  //         this.isLoading = false;
  //       },
  //       (err) => {
  //         this.loadingError = err._body || err.message || err;
  //         this.isLoading = false;
  //       },
  //       () => {
  //         console.log('done');
  //         this.isLoading = false;
  //       }
  //     );
  // }

  onDateRangeChange(criteria: FilterCriteria) {
    this.loadGames(criteria);
    // this.search(criteria);
  }

  loadGames(criteria?: FilterCriteria) {
    // this._router.navigate(['/games', FilterCriteria.serialise(criteria)]);
    this.store.dispatch(go(['/games', FilterCriteria.serialise(criteria)]));
  }

  // private setFiltering(params: Params) {
  //   const defaultFilter = this.criteria || new FilterCriteria();
  //   return this.criteria = isEmpty(params) ?
  //     defaultFilter :
  //     FilterCriteria.deserialise(params, defaultFilter);
  // }
}
