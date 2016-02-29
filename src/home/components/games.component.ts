import {Component, OnInit} from 'angular2/core';

import {Game} from '../../shared/models/game.model';
import {GameService} from '../../shared/services/game.service';
import {GamesTableComponent} from './games-table.component';
import {DateRangeComponent} from './date-range.component';
import {FilterCriteria} from '../../shared/models/filter-criteria.model';

@Component({
  selector: 'agot-games',
  moduleId: module.id,
  viewProviders: [GameService],
  templateUrl: './games.html',
  directives: [GamesTableComponent, DateRangeComponent]
})
export class GamesComponent implements OnInit {
  games:Game[];
  loadingError:any = null;

  constructor(private _GameService:GameService) {
  }

  ngOnInit() {
    this.loadGames();
  }

  onDateRangeChange(criteria:FilterCriteria) {
    this.loadGames(criteria);
  }

  loadGames(criteria?:FilterCriteria) {
    let gamesStream;
    if (criteria) {
      gamesStream = this._GameService.getGames(criteria);
    } else {
      gamesStream = this._GameService.getAllGames();
    }
    gamesStream
      .subscribe(
        (games:Game[]) => {
          this.loadingError = null;
          this.games = games;
        },
        (err) => {
          this.loadingError = err._body || err;
        },
        () => console.log('done')
      );
  }
}
