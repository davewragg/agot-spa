import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {GameService} from '../shared/services/game.service';
import {Game} from '../shared/models/game.model';
import {GameFormComponent} from './game-form.component';

@Component({
  selector: 'agot-game-details',
  moduleId: module.id,
  viewProviders: [GameService],
  template: `
    <section>
      <h1>{{ editing ? 'Edit' : 'View' }} Game</h1>
      <div *ngIf="game">
        <agot-game-form [game]="game" *ngIf="editing" (submit)="onSubmit(game)"></agot-game-form>
        <div *ngIf="!editing">
          {{ game | json }}
        </div>
      </div>
      <div *ngIf="!game">
        <h3 class="error">Game not found</h3>
      </div>
      <div><a [routerLink]="['/Home']">Back to list</a></div>
    </section>
  `,
  //templateUrl: './game-details.html',
  //styleUrls: ['./game-details.css']
  directives: [ROUTER_DIRECTIVES, GameFormComponent]
})
export class GameDetailsComponent implements OnInit {
  game:Game;
  gameId:number;
  editing:boolean;

  constructor(params:RouteParams, private _GameService:GameService) {
    this.editing = !!params.get('edit');
    this.gameId = <number>+params.get('id');
  }

  ngOnInit() {
    if (this.gameId) {
      this._GameService.getGame(this.gameId)
        .subscribe((game) => this.game = game);
    }
  }

  onSubmit(game:Game) {
    // TODO call gameservice
    console.log('details submit', game);
    this._GameService.updateGame(game).subscribe((game:Game) => {
      this.game = game;
      this.editing = false;
    }, (error) => {
      // TODO
      console.error(error);
    });
  }
}
