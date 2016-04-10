import {Component, OnInit, Input} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {Game} from '../../shared/models/game.model';
import {GameService} from '../../shared/services/game.service';
import {GamesTableComponent} from './games-table.component';
import {DateRangeComponent} from './date-range.component';
import {FilterCriteria} from '../../shared/models/filter-criteria.model';
import {SpinnerComponent} from '../../shared/components/spinner.component';
import {GameTimelineChart} from '../../shared/components/game-timeline-chart';

@Component({
  selector: 'agot-games',
  templateUrl: './home/components/games.html',
  directives: [GamesTableComponent, DateRangeComponent, SpinnerComponent, GameTimelineChart]
})
export class GamesComponent implements OnInit {
  @Input()
  title:string;
  @Input()
  initialFiltering:FilterCriteria;
  @Input()
  hideFilters:boolean = false;

  games:Game[];
  loadingError:any = null;
  isLoading:boolean;

  constructor(params:RouteParams,
              private _router:Router,
              private _gameService:GameService) {
    this.setInitialFiltering(params);
  }

  ngOnInit() {
    this.loadGames(this.initialFiltering);
  }

  onDateRangeChange(criteria:FilterCriteria) {
    //this.loadGames(criteria);
    this._router.navigate(['Games', FilterCriteria.serialise(criteria)]);
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

  private setInitialFiltering(params:RouteParams) {
    this.initialFiltering = Object.assign(this.initialFiltering || {}, FilterCriteria.deserialise(params));
  }
}
