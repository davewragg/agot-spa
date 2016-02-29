import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {FormBuilder, ControlGroup} from 'angular2/common';
import {FilterCriteria} from '../../shared/models/filter-criteria.model';
import {Season} from '../../shared/models/season.model';

@Component({
  selector: 'agot-date-range',
  moduleId: module.id,
  templateUrl: './date-range.html',
})
export class DateRangeComponent {
  @Input()
  criteria:FilterCriteria = <FilterCriteria>{
    ascending: false
  };
  @Input()
  showSort:boolean = true;
  @Output()
  rangeChange:EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  showCustomRange:boolean = false;

  seasons:Season[];
  dateRangeForm:ControlGroup;

  constructor(private _FormBuilder:FormBuilder) {
    // TODO season service
  }

  ngOnInit() {
    this.buildForm();
  }

  onSortChange(ascending:boolean) {
    this.criteria.ascending = ascending;
    this.onExecute();
  }

  onExecute() {
    //.debounceTime(400).distinctUntilChanged()
    this.rangeChange.emit(this.criteria);
  }

  private buildForm() {
    this.dateRangeForm = this._FormBuilder.group({
      fromDate: [this.criteria.fromDate],
      toDate: [this.criteria.toDate],
    });
  }
}
