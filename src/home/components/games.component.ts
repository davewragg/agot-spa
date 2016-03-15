import {Component, OnInit, Input} from 'angular2/core';

import {Game} from '../../shared/models/game.model';
import {GameService} from '../../shared/services/game.service';
import {GamesTableComponent} from './games-table.component';
import {DateRangeComponent} from './date-range.component';
import {FilterCriteria} from '../../shared/models/filter-criteria.model';
import {SpinnerComponent} from '../../shared/components/spinner.component';

@Component({
  selector: 'agot-games',
  moduleId: module.id,
  viewProviders: [GameService],
  templateUrl: './games.html',
  directives: [GamesTableComponent, DateRangeComponent, SpinnerComponent]
})
export class GamesComponent implements OnInit {
  @Input()
  title:string;
  @Input()
  defaultFiltering:FilterCriteria;
  @Input()
  hideFilters:boolean = false;

  games:Game[];
  loadingError:any = null;
  isLoading:boolean;

  constructor(private _gameService:GameService) {
  }

  ngOnInit() {
    this.loadGames(this.defaultFiltering);
  }

  onDateRangeChange(criteria:FilterCriteria) {
    this.loadGames(criteria);
  }

  loadGames(criteria?:FilterCriteria) {
    this.isLoading = true;
    this._gameService.getGames(criteria)
      .subscribe(
        (games:Game[]) => {
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
}
