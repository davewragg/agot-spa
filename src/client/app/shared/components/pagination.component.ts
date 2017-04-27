import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { FilterCriteria } from '../models/filter-criteria.model';

@Component({
  moduleId: module.id,
  selector: 'agot-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="recordsRemaining > 0 && !loading">
      <button (click)="onExecute()" class="btn btn-secondary btn-block">
        Show more
        <small>(showing {{ criteria.offset + 1 }}-{{ criteria.offset + criteria.limit }} of
          {{ totalRecords }})
        </small>
      </button>
    </div>
    <agot-spinner [isRunning]="loading"></agot-spinner>
  `,
})
export class PaginationComponent implements OnChanges {
  @Input()
  criteria: FilterCriteria;
  @Input()
  totalRecords: number = 0;
  @Input()
  loading: boolean = false;

  @Output()
  showMore: EventEmitter<number> = new EventEmitter<number>();

  recordsRemaining: number;

  ngOnChanges(): void {
    if (!this.criteria) {
      return;
    }
    const { limit, offset } = this.criteria;
    this.recordsRemaining = this.totalRecords - (limit + offset);
  }

  onExecute() {
    const newLimit = this.criteria.limit + FilterCriteria.DEFAULT_PAGE_SIZE;
    return this.showMore.emit(newLimit);
  }
}
