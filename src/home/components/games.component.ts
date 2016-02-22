import {Component, OnInit} from 'angular2/core';

import {ROUTER_DIRECTIVES} from 'angular2/router';

import {Game} from '../../shared/models/game.model';
import {GameService} from '../../shared/services/game.service';
import {DateFormatPipe} from '../../shared/pipes/date-format-pipe';
import {FindWinnerPipe} from '../../shared/pipes/find-winner-pipe';

@Component({
  selector: 'agot-games',
  moduleId: module.id,
  viewProviders: [GameService],
  templateUrl: './games.html',
  //styleUrls: ['./games.css'],
  pipes: [DateFormatPipe, FindWinnerPipe],
  directives: [ROUTER_DIRECTIVES]
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
    this._GameService.getGames()
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
