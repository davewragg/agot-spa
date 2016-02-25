import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {GameService} from '../shared/services/game.service';
import {Game} from '../shared/models/game.model';
import {GameFormComponent} from './game-form.component';

@Component({
  selector: 'agot-game-details',
  moduleId: module.id,
  viewProviders: [GameService],
  templateUrl: './game-details.html',
  //styleUrls: ['./game-details.css']
  directives: [ROUTER_DIRECTIVES, GameFormComponent]
})
export class GameDetailsComponent implements OnInit {
  game:Game;
  gameId:number;
  editing:boolean = false;
  formDisabled:boolean = false;

  constructor(params:RouteParams, private _GameService:GameService) {
    this.gameId = <number>+params.get('id');
    this.editing = !!params.get('edit') || !this.gameId;
  }

  ngOnInit() {
    if (this.gameId) {
      this._GameService.getGame(this.gameId)
        .subscribe((game) => this.game = game);
    } else {
      this.game = GameService.createNewGame();
    }
  }

  onSubmit(game:Game) {
    this.formDisabled = true;
    //const winner = game.gamePlayers.find((player) => player.isWinner).player.name;
    //console.log(winner);

    console.log('details submit', game);
    this._GameService.updateGame(game).subscribe((game:Game) => {
      this.game = game;
      this.formDisabled = false;
      this.editing = false;
    }, (error) => {
      // TODO
      this.formDisabled = false;
      console.error(error);
    });
  }

  onCancel() {
    this.editing = false;
    // TODO restore / reset values?
  }

  onEdit() {
    this.editing = true;
  }
}
