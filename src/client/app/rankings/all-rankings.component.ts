import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { isEmpty } from 'lodash';
import { RankingService } from '../shared/services/ranking.service';
import { SetOfResults } from '../shared/models/set-of-results.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
// import { RankingsComponent } from './rankings.component';
// import { SpinnerComponent } from '../shared/components/spinner.component';
// import { DateRangeComponent } from '../home/components/date-range.component';

@Component({
  moduleId: module.id,
  selector: 'agot-all-rankings',
  templateUrl: 'all-rankings.component.html',
  // directives: [RankingsComponent, SpinnerComponent, DateRangeComponent]
})
export class AllRankingsComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  hideFilters: boolean = false;
  @Input()
  initialFiltering: FilterCriteria;

  results: SetOfResults;
  loadingError: any = null;
  isLoading: boolean;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _RankingService: RankingService) {

  }

  ngOnInit() {
    // this.setInitialFiltering(params);
    // this.loadRankings(this.initialFiltering);
    this._route.params
      .map(this.setInitialFiltering.bind(this))
      .do(() => this.isLoading = true)
      .switchMap((criteria: FilterCriteria) => this._RankingService.getRankings(criteria))
      .subscribe(
        (results) => {
          this.loadingError = null;
          this.results = results;
        },
        (err) => {
          this.loadingError = err._body || err;
          this.isLoading = false;
        },
        () => {
          console.log('rankings component done');
          this.isLoading = false;
        }
      );
  }

  onDateRangeChange(criteria: FilterCriteria) {
    this.loadRankings(criteria);
    // this._router.navigate(['/rankings', FilterCriteria.serialise(criteria)]);
  }

  loadRankings(criteria?: FilterCriteria) {
    //   this.isLoading = true;
    //   return this._RankingService.getRankings(criteria);
    this._router.navigate(['/rankings', FilterCriteria.serialise(criteria)]);
  }

  private setInitialFiltering(params: Params) {
    const defaultFilter = this.initialFiltering || {};
    return isEmpty(params) ?
      defaultFilter :
      Object.assign(defaultFilter, FilterCriteria.deserialise(params));
  }
}
