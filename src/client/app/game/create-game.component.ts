import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../shared/services/game.service';
import { NotificationService } from '../shared/services/notification.service';
import { Game } from '../shared/models/game.model';

@Component({
  moduleId: module.id,
  selector: 'agot-create-game',
  templateUrl: 'create-game.component.html',
})
export class CreateGameComponent implements OnInit {
  game: Game;

  formDisabled: boolean = false;
  isLoading: boolean;

  constructor(private gameService: GameService,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.game = new Game();
  }

  onSubmit(game: Game) {
    this.formDisabled = true;
    this.isLoading = true;

    console.log('details submit', game);

    this.gameService.updateGame(game).subscribe((game: Game) => {
        return this.router.navigate(['/games', game.gameId]);
      }, (error) => {
        this.formDisabled = false;
        console.error(error);
        this.notificationService.error('Whoops', error.message || error._body || error);
        this.isLoading = false;
      }, () => this.isLoading = false
    );
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
