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
        <agot-game-form [game]="game" *ngIf="editing" [disabled]="formDisabled"
          (submit)="onSubmit(game)" (cancel)="onCancel()"></agot-game-form>
        <div *ngIf="!editing">
          {{ game | json }}

          <div>
            <button type="button" class="btn" (click)="onEdit()">Edit</button>
          </div>
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
  formDisabled:boolean = false;

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
    this.formDisabled = true;
    // TODO call gameservice
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
  }

  onEdit() {
    this.editing = true;
  }
}
