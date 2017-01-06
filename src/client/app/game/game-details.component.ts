import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { GameService } from '../shared/services/game.service';
import { Game } from '../shared/models/game.model';
import { NotificationService } from '../shared/services/notification.service';

@Component({
  moduleId: module.id,
  selector: 'agot-game-details',
  templateUrl: 'game-details.component.html',
})
export class GameDetailsComponent implements OnInit {
  game: Game;

  editing: boolean = false;
  formDisabled: boolean = false;
  isLoading: boolean;
  loadError: any = null;

  constructor(private _route: ActivatedRoute,
              private gameService: GameService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this._route.params
      .do(() => this.isLoading = true)
      .switchMap((params: Params) => this.gameService.getGame(+params['id']))
      .subscribe(
        (game) => {
          this.isLoading = false;
          return this.game = game;
        },
        (error) => {
          this.isLoading = false;
          return this.loadError = error;
        },
        () => this.isLoading = false
      );
  }

  onSubmit(game: Game) {
    this.formDisabled = true;
    this.isLoading = true;

    console.log('details submit', game);
    // TODO if creating, redirect to /game/id on submit?
    this.gameService.updateGame(game).subscribe((game: Game) => {
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
    this.editing = false;
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
