import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { pull, cloneDeep } from 'lodash';
import { ReferenceDataService } from '../services/reference-data.service';
import { FilterCriteria } from '../models/filter-criteria.model';
import { Faction } from '../models/faction.model';

@Component({
  moduleId: module.id,
  selector: 'agot-faction-filter',
  templateUrl: 'faction-filter.component.html',
})
export class FactionFilterComponent implements OnInit {
  @Input()
  criteria: FilterCriteria;
  @Output()
  factionChange: EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  factions: Observable<Faction[]>;
  expanded: boolean = false;

  constructor(private referenceDataService: ReferenceDataService) {
    this.factions = referenceDataService.factions;
  }

  ngOnInit() {
    if (!this.criteria) {
      this.criteria = new FilterCriteria();
    } else {
      this.expanded = !!this.criteria.factionIds.length;
      this.criteria = cloneDeep(this.criteria);
    }
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  onFactionChange($event: any) {
    //.debounceTime(400).distinctUntilChanged()
    const checked = $event.target.checked;
    const factionId = +$event.target.value;
    if (checked && !this.criteria.factionIds.includes(factionId)) {
      this.criteria.factionIds.push(factionId);
    } else if (!checked) {
      pull(this.criteria.factionIds, factionId);
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
