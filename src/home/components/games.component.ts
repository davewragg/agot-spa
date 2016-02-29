import {Component, OnInit} from 'angular2/core';

import {Game} from '../../shared/models/game.model';
import {GameService} from '../../shared/services/game.service';
import {GamesTableComponent} from './games-table.component';

@Component({
  selector: 'agot-games',
  moduleId: module.id,
  viewProviders: [GameService],
  templateUrl: './games.html',
  directives: [GamesTableComponent]
})
export class GamesComponent implements OnInit {
  games:Game[];
  loadingError:any = null;

  constructor(private _GameService:GameService) {
  }

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    this._GameService.getAllGames()
      .subscribe(
        (games: Game[]) => {
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
