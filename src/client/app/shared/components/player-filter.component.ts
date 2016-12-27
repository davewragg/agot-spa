import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FilterCriteria } from '../models/filter-criteria.model';
import { PlayerService } from '../services/player.service';
import { Observable } from 'rxjs/Observable';
import { Player } from '../models/player.model';
import * as _ from 'lodash';

@Component({
  selector: 'agot-player-filter',
  templateUrl: 'shared/components/player-filter.component.html',
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

  ngOnInit() {
    if (!this.criteria) {
      this.criteria = new FilterCriteria();
    }
  }

  onPlayerChange($event: any) {
    //.debounceTime(400).distinctUntilChanged()
    const checked = $event.target.checked;
    const playerId = +$event.target.value;
    if (checked && !_.includes(this.criteria.playerIds, playerId)) {
      this.criteria.playerIds.push(playerId);
    } else if (!checked) {
      _.pull(this.criteria.playerIds, playerId);
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
