import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Player } from '../../shared/models/player.model';

@Component({
  moduleId: module.id,
  selector: 'agot-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  @Input()
  currentPlayer: Player;
}
