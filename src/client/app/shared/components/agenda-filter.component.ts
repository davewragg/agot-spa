import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ReferenceDataService } from '../services/reference-data.service';
import { FilterCriteria } from '../models/filter-criteria.model';
import { Observable } from 'rxjs/Observable';
import { Agenda } from '../models/agenda.model';
import * as _ from 'lodash';
// import { AgendaBadgeComponent } from './agenda-badge.component';

@Component({
  moduleId: module.id,
  selector: 'agot-agenda-filter',
  templateUrl: 'agenda-filter.component.html',
  // directives: [AgendaBadgeComponent]
})
export class AgendaFilterComponent implements OnInit {
  @Input()
  criteria: FilterCriteria;
  @Output()
  agendaChange: EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  agendas: Observable<Agenda[]>;
  expanded: boolean = false;

  constructor(private referenceDataService: ReferenceDataService) {
    this.agendas = referenceDataService.agendas;
  }

  ngOnInit() {
    if (!this.criteria) {
      this.criteria = new FilterCriteria();
    } else {
      this.expanded = !!this.criteria.agendaIds.length;
    }
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  onAgendaChange($event: any) {
    //.debounceTime(400).distinctUntilChanged()
    const checked = $event.target.checked;
    const agendaId = +$event.target.value;
    if (checked && !_.includes(this.criteria.agendaIds, agendaId)) {
      this.criteria.agendaIds.push(agendaId);
    } else if (!checked) {
      _.pull(this.criteria.agendaIds, agendaId);
    }
    console.log(agendaId);
    this.onExecute();
  }

  onClear() {
    this.criteria.agendaIds.length = 0;
    this.onExecute();
  }

  onExecute() {
    //.debounceTime(400).distinctUntilChanged()
    this.agendaChange.emit(this.criteria);
  }
}
