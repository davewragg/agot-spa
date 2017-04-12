import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { without, cloneDeep } from 'lodash';
import { FilterCriteria } from '../models/filter-criteria.model';
import { Player } from '../models/player.model';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../state-management/reducers/root';

@Component({
  moduleId: module.id,
  selector: 'agot-player-filter',
  templateUrl: 'player-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerFilterComponent implements OnChanges {
  @Input()
  criteria: FilterCriteria;
  @Output()
  playerChange: EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  players$: Observable<Player[]>;

  constructor(private store: Store<fromRoot.State>) {
    this.players$ = store.select(fromRoot.getGroupPlayers);
  }

  ngOnChanges() {
    if (!this.criteria) {
      this.criteria = new FilterCriteria();
    } else {
      this.criteria = cloneDeep(this.criteria);
    }
  }

  onPlayerChange($event: any) {
    //.debounceTime(400).distinctUntilChanged()
    const { checked, value: playerId } = $event.target;

    let updatedCriteria: FilterCriteria;
    if (checked && !this.criteria.playerIds.includes(playerId)) {
      updatedCriteria = FilterCriteria.patchValues(this.criteria, {
        playerIds: [
          ...this.criteria.playerIds,
          playerId,
        ]
      });
    } else if (!checked) {
      updatedCriteria = FilterCriteria.patchValues(this.criteria, {
        playerIds: without(this.criteria.playerIds, playerId),
      });
    }
    console.log(playerId);
    this.onExecute(updatedCriteria);
  }

  onClear() {
    const updatedCriteria = FilterCriteria.patchValues(this.criteria, {
      playerIds: [],
    });
    this.onExecute(updatedCriteria);
  }

  onExecute(criteria: FilterCriteria) {
    //.debounceTime(400).distinctUntilChanged()
    this.playerChange.emit(criteria);
  }
}
