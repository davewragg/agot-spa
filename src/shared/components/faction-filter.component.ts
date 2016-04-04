import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {ReferenceDataService} from '../services/reference-data.service';
import {FilterCriteria} from '../../shared/models/filter-criteria.model';
import {Observable} from 'rxjs/Observable';
import {Faction} from '../models/faction.model';
import * as _ from 'lodash';

@Component({
  selector: 'agot-faction-filter',
  moduleId: module.id,
  templateUrl: './faction-filter.component.html',
})
export class FactionFilterComponent implements OnInit {
  @Input()
  criteria:FilterCriteria;
  @Output()
  factionChange:EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  factions:Observable<Faction[]>;

  constructor(private referenceDataService:ReferenceDataService) {
    this.factions = referenceDataService.factions;
  }

  ngOnInit() {
    if (!this.criteria) {
      this.criteria = new FilterCriteria();
    }
  }

  onFactionChange($event:any) {
    //.debounceTime(400).distinctUntilChanged()
    const checked = $event.target.checked;
    const factionId = +$event.target.value;
    if (checked && !_.includes(this.criteria.factionIds, factionId)) {
      this.criteria.factionIds.push(factionId);
    } else if (!checked) {
      _.pull(this.criteria.factionIds, factionId);
    }
    console.log(factionId);
    this.onExecute();
  }

  onClear() {
    this.criteria.factionIds.length = 0;
    this.onExecute();
  }

  onExecute() {
    //.debounceTime(400).distinctUntilChanged()
    this.factionChange.emit(this.criteria);
  }
}
