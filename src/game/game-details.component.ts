import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {GameService} from '../shared/services/game.service';
import {Game} from '../shared/models/game.model';
import {GameFormComponent} from './game-form.component';
import {ViewGameComponent} from './view-game.component';

@Component({
  selector: 'agot-game-details',
  moduleId: module.id,
  viewProviders: [GameService],
  templateUrl: './game-details.html',
  //styleUrls: ['./game-details.css']
  directives: [GameFormComponent, ViewGameComponent]
})
export class GameDetailsComponent implements OnInit {
  game:Game;
  gameIdParam:number;
  editParam:boolean;

  editing:boolean = false;
  formDisabled:boolean = false;

  constructor(params:RouteParams, private _GameService:GameService, private router:Router) {
    this.gameIdParam = <number>+params.get('id');
    this.editParam = !!params.get('edit');
    this.editing = this.editParam || !this.gameIdParam;
  }

  ngOnInit() {
    if (this.gameIdParam) {
      this._GameService.getGame(this.gameIdParam)
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
    // if creating or editing directly, GTFO
    if (!this.game.gameId || this.editParam) {
      this.router.navigate(['/Home']);
    } else {
      this.editing = false;
    }
  }

  onEdit() {
    this.editing = true;
  }
}
