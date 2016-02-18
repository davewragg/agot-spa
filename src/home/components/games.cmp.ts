import {Component, OnInit} from 'angular2/core';

import {Game} from '../../shared/models/game.model';
import {GameService} from '../../shared/services/game.service';

@Component({
  selector: 'agot-games',
  moduleId: module.id,
  viewProviders: [GameService],
  templateUrl: './games.cmp.html',
  styleUrls: ['./games.cmp.css']
})
export class GamesCmp implements OnInit {
  games:Game[];

  constructor(private _GameService:GameService) {
  }

  ngOnInit() {
    this.games = this._GameService.getGames();
  }
}
