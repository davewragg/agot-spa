import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {GameService} from '../shared/services/game.service';
import {Game} from '../shared/models/game.model';

@Component({
  selector: 'agot-edit-game',
  moduleId: module.id,
  viewProviders: [GameService],
  template: `
    {{ game | json }}
  `,
  //templateUrl: './about.html',
  //styleUrls: ['./about.css']
})
export class EditGameComponent {
  game:Game;

  constructor(params:RouteParams, private _GameService:GameService) {
    let gameId;
    try {
      gameId = <number>+params.get('id');
    } catch (error) {
      // TODO log error elsewhere?
      console.error(error);
      return;
    }
    this._GameService.getGame(gameId).subscribe((game) => this.game = game);
  }
}
