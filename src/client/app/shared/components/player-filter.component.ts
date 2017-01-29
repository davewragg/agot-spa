import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { pull, cloneDeep } from 'lodash';
import { PlayerService } from '../services/player.service';
import { FilterCriteria } from '../models/filter-criteria.model';
import { Player } from '../models/player.model';

@Component({
  moduleId: module.id,
  selector: 'agot-player-filter',
  templateUrl: 'player-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerFilterComponent implements OnInit {
  @Input()
  criteria: FilterCriteria;
  @Output()
  playerChange: EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  players: Observable<Player[]>;

  constructor(private playerService: PlayerService) {
    this.players = playerService.getPlayers();
  }

  // TODO refactor this to be immutable - return a new object on every event
  // use OnChanges?

  ngOnInit() {
    if (!this.criteria) {
      this.criteria = new FilterCriteria();
    } else {
      this.criteria = cloneDeep(this.criteria);
    }
  }

  onPlayerChange($event: any) {
    //.debounceTime(400).distinctUntilChanged()
    const checked = $event.target.checked;
    const playerId = $event.target.value;
    if (checked && !this.criteria.playerIds.includes(playerId)) {
      this.criteria.playerIds.push(playerId);
    } else if (!checked) {
      pull(this.criteria.playerIds, playerId);
    }
    console.log(playerId);
    this.onExecute();
  }

  onClear() {
    this.criteria.playerIds.length = 0;
    this.onExecute();
  }

  onExecute() {
    //.debounceTime(400).distinctUntilChanged()
    this.playerChange.emit(this.criteria);
  }
}
