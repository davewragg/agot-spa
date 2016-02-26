import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {GameService} from '../shared/services/game.service';
import {Game} from '../shared/models/game.model';
import {GameFormComponent} from './game-form.component';
import {ViewGameComponent} from './view-game.component';
import {NotificationService} from '../shared/services/notification.service';

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

  constructor(params:RouteParams,
              private gameService:GameService,
              private router:Router,
              private notificationService:NotificationService) {
    this.gameIdParam = <number>+params.get('id');
    this.editParam = !!params.get('edit');
    this.editing = this.editParam || !this.gameIdParam;
  }

  ngOnInit() {
    if (this.gameIdParam) {
      this.gameService.getGame(this.gameIdParam)
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
    this.gameService.updateGame(game).subscribe((game:Game) => {
      this.game = game;
      this.formDisabled = false;
      this.editing = false;
    }, (error) => {
      this.formDisabled = false;
      console.error(error);
      this.notificationService.error('Whoops', error.message || error._body || error);
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

  onDelete() {
    console.log('delete', this.game);
    this.gameService.deleteGame(this.game.gameId).subscribe((result) => {
      this.game = null;
      this.notificationService.success('There', `I hope you're happy`);
    }, (error) => {
      console.error(error);
      this.notificationService.error('Whoops', error.message || error._body || error);
    });
  }
}
