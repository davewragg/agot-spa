import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PlayerGroup } from '../shared/models/player-group.model';

@Component({
  moduleId: module.id,
  selector: 'agot-groups-list',
  templateUrl: 'groups-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .icon {
      height: 2.4em;
    }
  `],
})
export class GroupsListComponent {
  @Input()
  groups: PlayerGroup[];
}