import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../../state-management/reducers/root';
import { pull, cloneDeep } from 'lodash';
import { FilterCriteria } from '../models/filter-criteria.model';
import { PlayerGroup } from '../models/player-group.model';

@Component({
  moduleId: module.id,
  selector: 'agot-player-group-selector',
  templateUrl: 'player-group-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerGroupSelectorComponent implements OnInit {
  @Input()
  playerGroup: FilterCriteria | number;
  criteria: FilterCriteria;
  @Input()
  multiSelect: boolean = false;
  @Output()
  playerGroupChange: EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  playerGroups$: Observable<PlayerGroup[]>;

  private static getCriteria(playerGroup: FilterCriteria | number) {
    if (typeof playerGroup === 'number') {
      const criteria = new FilterCriteria();
      criteria.playerGroupIds = [playerGroup];
      return criteria;
    }
    return cloneDeep(playerGroup);
  }

  constructor(private store: Store<fromRoot.State>) {
    this.playerGroups$ = store.select(fromRoot.getAllPlayerGroups);
  }

  ngOnInit() {
    this.criteria = this.playerGroup ?
      PlayerGroupSelectorComponent.getCriteria(this.playerGroup) : new FilterCriteria();
  }

  onPlayerGroupChange($event: any) {
    const checked = $event.target.checked;
    const playerGroupId = +$event.target.value;
    if (this.multiSelect) {
      this.processMultiSelectChange(checked, playerGroupId);
    } else {
      // this.criteria.playerGroupIds = checked ? [playerGroupId] : [];
      if (!checked) return;
      this.criteria.playerGroupIds = [playerGroupId];
    }
    console.log(playerGroupId, checked);
    this.onExecute();
  }

  onClear() {
    this.criteria.playerGroupIds.length = 0;
    this.onExecute();
  }

  onExecute() {
    //.debounceTime(400).distinctUntilChanged()
    this.playerGroupChange.emit(this.criteria);
  }

  private processMultiSelectChange(checked: boolean, playerGroupId: number) {
    if (checked && !this.criteria.playerGroupIds.includes(playerGroupId)) {
      this.criteria.playerGroupIds.push(playerGroupId);
    } else if (!checked) {
      pull(this.criteria.playerGroupIds, playerGroupId);
    }
  }

}
