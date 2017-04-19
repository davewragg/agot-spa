import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PlayerGroup } from '../shared/models/player-group.model';

@Component({
  moduleId: module.id,
  selector: 'agot-groups-list',
  templateUrl: 'groups-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsListComponent {
  @Input()
  groups: PlayerGroup[];
}
