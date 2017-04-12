import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { without, cloneDeep } from 'lodash';
import { FilterCriteria } from '../models/filter-criteria.model';
import { Agenda } from '../models/agenda.model';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../state-management/reducers/root';

@Component({
  moduleId: module.id,
  selector: 'agot-agenda-filter',
  templateUrl: 'agenda-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgendaFilterComponent implements OnChanges {
  @Input()
  criteria: FilterCriteria;
  @Output()
  agendaChange: EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  agendas$: Observable<Agenda[]>;
  expanded: boolean = false;

  constructor(private store: Store<fromRoot.State>) {
    this.agendas$ = store.select(fromRoot.getAgendasList);
  }

  ngOnChanges() {
    if (!this.criteria) {
      this.criteria = new FilterCriteria();
    } else {
      this.expanded = !!this.criteria.agendaIds.length;
      this.criteria = cloneDeep(this.criteria);
    }
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  onAgendaChange($event: any) {
    //.debounceTime(400).distinctUntilChanged()
    const checked = $event.target.checked;
    const agendaId = +$event.target.value;

    let updatedCriteria: FilterCriteria;

    if (checked && !this.criteria.agendaIds.includes(agendaId)) {
      updatedCriteria = FilterCriteria.patchValues(this.criteria, {
        agendaIds: [
          ...this.criteria.agendaIds,
          agendaId,
        ]
      });
    } else if (!checked) {
      updatedCriteria = FilterCriteria.patchValues(this.criteria, {
        agendaIds: without(this.criteria.agendaIds, agendaId),
      });
    }
    console.log(agendaId);
    this.onExecute(updatedCriteria);
  }

  onClear() {
    const updatedCriteria = FilterCriteria.patchValues(this.criteria, {
      agendaIds: [],
    });
    this.onExecute(updatedCriteria);
  }

  onExecute(criteria: FilterCriteria) {
    //.debounceTime(400).distinctUntilChanged()
    this.agendaChange.emit(criteria);
  }
}
