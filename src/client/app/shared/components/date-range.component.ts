import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FilterCriteria } from '../models/filter-criteria.model';
import { Season } from '../models/season.model';
import { DateRangeType } from '../models/date-range-type.model';
import * as fromRoot from '../../state-management/reducers/root';

@Component({
  moduleId: module.id,
  selector: 'agot-date-range',
  templateUrl: 'date-range.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeComponent {
  dateForm: FormGroup = new FormGroup({
    rangeSelection: new FormControl('', Validators.required),
    ascending: new FormControl(''),
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
  });

  @Input()
  set criteria(criteria: FilterCriteria) {
    if (criteria) {
      this.setSelectedSeason(criteria);
      this.setShowCustomDates(criteria);
      this.dateForm.patchValue(criteria, { emitEvent: false });
    }
  }

  @Input()
  showSort: boolean = true;
  @Output()
  rangeChange: EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  rangeSelection: DateRangeType;
  dateRangeType = DateRangeType;
  seasons$: Observable<Season[]>;

  selectedSeason: string;
  showCustomDates: boolean;

  constructor(private store: Store<fromRoot.State>) {
    this.seasons$ = this.store.select(fromRoot.getSeasons);
  }

  onSetSeason(season: Season) {
    const { startDate, endDate } = season;
    this.dateForm.patchValue({
      rangeSelection: DateRangeType.CUSTOM,
      fromDate: startDate,
      toDate: endDate,
    });
    this.onExecute();
  }

  onExecute() {
    const values = this.dateForm.value;
    return this.rangeChange.emit(values);
  }

  private setShowCustomDates(criteria: FilterCriteria) {
    this.showCustomDates = criteria.rangeSelection === DateRangeType.CUSTOM;
  }

  private setSelectedSeason(criteria: FilterCriteria) {
    this.selectedSeason = `${criteria.fromDate}:${criteria.toDate}`;
  }
}
