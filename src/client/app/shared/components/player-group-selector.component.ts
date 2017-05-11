import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../../state-management/reducers/root';
import { PlayerGroup } from '../models/player-group.model';

@Component({
  moduleId: module.id,
  selector: 'agot-player-group-selector',
  templateUrl: 'player-group-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerGroupSelectorComponent {
  @Input()
  playerGroupId: number;
  @Input()
  allowAll: boolean = false;
  @Output()
  playerGroupChange: EventEmitter<number> = new EventEmitter<number>();

  showAll: boolean = false;

  myPlayerGroups$: Observable<PlayerGroup[]>;
  playerGroups$: Observable<PlayerGroup[]>;

  constructor(private store: Store<fromRoot.State>) {
    this.playerGroups$ = store.select(fromRoot.getAllPlayerGroups);
    this.myPlayerGroups$ = store.select(fromRoot.getMyPlayerGroups);
  }

  onPlayerGroupChange($event: any) {
    const checked = $event.target.checked;
    const playerGroupId = +$event.target.value;
    if (!checked) return;
    console.log(playerGroupId, checked);
    this.onExecute(playerGroupId);
  }

  onExecute(playerGroupId: number) {
    this.playerGroupChange.emit(playerGroupId);
  }
}
