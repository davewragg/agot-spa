import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { without, cloneDeep } from 'lodash';
import { FilterCriteria } from '../models/filter-criteria.model';
import { Faction } from '../models/faction.model';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../state-management/reducers/root';

@Component({
  moduleId: module.id,
  selector: 'agot-faction-filter',
  templateUrl: 'faction-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactionFilterComponent implements OnChanges {
  @Input()
  criteria: FilterCriteria;
  @Output()
  factionChange: EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  factions$: Observable<Faction[]>;
  expanded: boolean = false;

  constructor(private store: Store<fromRoot.State>) {
    this.factions$ = store.select(fromRoot.getFactionsList);
  }

  ngOnChanges(changes?: any) {
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

    let updatedCriteria: FilterCriteria;

    if (checked && !this.criteria.factionIds.includes(factionId)) {
      updatedCriteria = FilterCriteria.patchValues(this.criteria, {
        factionIds: [
          ...this.criteria.factionIds,
          factionId,
        ]
      });
    } else if (!checked) {
      updatedCriteria = FilterCriteria.patchValues(this.criteria, {
        factionIds: without(this.criteria.factionIds, factionId),
      });
    }
    console.log(factionId);
    this.onExecute(updatedCriteria);
  }

  onClear() {
    const updatedCriteria = FilterCriteria.patchValues(this.criteria, {
      factionIds: [],
    });
    this.onExecute(updatedCriteria);
  }

  onExecute(criteria: FilterCriteria) {
    //.debounceTime(400).distinctUntilChanged()
    this.factionChange.emit(criteria);
  }
}
