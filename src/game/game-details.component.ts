import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {GameService} from '../shared/services/game.service';
import {Game} from '../shared/models/game.model';
import {GameFormComponent} from './game-form.component';
import {ViewGameComponent} from './view-game.component';
import {NotificationService} from '../shared/services/notification.service';
import {SpinnerComponent} from '../shared/components/spinner.component';

@Component({
  selector: 'agot-game-details',
  templateUrl: './game/game-details.html',
  directives: [GameFormComponent, ViewGameComponent, SpinnerComponent]
})
export class GameDetailsComponent implements OnInit {
  game:Game;
  gameIdParam:number;
  editParam:boolean;

  editing:boolean = false;
  formDisabled:boolean = false;
  isLoading:boolean;
  loadError:any = null;

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
      this.loadGame();
    } else {
      this.game = new Game();
    }
  }

  onSubmit(game:Game) {
    this.formDisabled = true;
    this.isLoading = true;
    const creating = !game.gameId;

    console.log('details submit', game);
    // TODO if creating, redirect to /game/id on submit?
    this.gameService.updateGame(game).subscribe((game:Game) => {
        if (creating) {
          // TODO skip reload
          this.router.navigate(['/GameDetails', {id: game.gameId}]);
          return;
        }
        this.game = game;
        this.formDisabled = false;
        this.editing = false;
      }, (error) => {
        this.formDisabled = false;
        console.error(error);
        this.notificationService.error('Whoops', error.message || error._body || error);
        this.isLoading = false;
      }, () => this.isLoading = false
    );
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

  private loadGame() {
    this.isLoading = true;
    this.gameService.getGame(this.gameIdParam)
      .subscribe(
        (game) => this.game = game,
        (error) => this.loadError = error,
        () => this.isLoading = false
      );
  }
}
