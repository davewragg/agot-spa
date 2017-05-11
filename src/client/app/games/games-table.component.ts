import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Game } from '../shared/models/game.model';

@Component({
  moduleId: module.id,
  selector: 'agot-games-table',
  templateUrl: 'games-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesTableComponent {
  @Input()
  games: Game[];

}
