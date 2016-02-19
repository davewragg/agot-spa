import {Component, OnInit} from 'angular2/core';

import {Game} from '../../shared/models/game.model';
import {GameService} from '../../shared/services/game.service';
import {DataService} from '../../shared/services/data.service';
import {DateFormatPipe} from '../../shared/pipes/date-format-pipe';
import {FindWinnerPipe} from '../../shared/pipes/find-winner-pipe';

@Component({
  selector: 'agot-games',
  moduleId: module.id,
  viewProviders: [GameService, DataService],
  templateUrl: './games.cmp.html',
  styleUrls: ['./games.cmp.css'],
  pipes: [DateFormatPipe, FindWinnerPipe]
})
export class GamesCmp implements OnInit {
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
        (data) => {
          this.loadingError = null;
          this.games = data;
        },
        (err) => {
          this.loadingError = err._body || err;
        },
        () => console.log('done')
      );
  }
}
