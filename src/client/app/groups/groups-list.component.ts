import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
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
  @Input()
  selectedGroupId: number;

  @Output()
  joinGroup: EventEmitter<PlayerGroup> = new EventEmitter<PlayerGroup>();
  @Output()
  selectGroup: EventEmitter<PlayerGroup> = new EventEmitter<PlayerGroup>();

  onJoin(group: PlayerGroup) {
    this.joinGroup.emit(group);
  }

  onSelect(group: PlayerGroup) {
    this.selectGroup.emit(group);
  }
}
