import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { isEmpty } from 'lodash';
import { RankingService } from '../shared/services/ranking.service';
import { SetOfResults } from '../shared/models/set-of-results.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';

@Component({
  moduleId: module.id,
  selector: 'agot-all-rankings',
  templateUrl: 'all-rankings.component.html',
})
export class AllRankingsComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  hideFilters: boolean = false;
  @Input()
  criteria: FilterCriteria;

  results: SetOfResults;
  loadingError: any = null;
  isLoading: boolean;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _RankingService: RankingService) {

  }

  ngOnInit() {
    this._route.params
      .map(this.setFiltering.bind(this))
      .do(() => this.isLoading = true)
      .switchMap((criteria: FilterCriteria) => this._RankingService.getRankings(criteria))
      .subscribe(
        (results) => {
          this.loadingError = null;
          this.results = results;
          // TODO until loading states are sorted out
          this.isLoading = false;
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
  }

  loadRankings(criteria?: FilterCriteria) {
    this._router.navigate(['/rankings', FilterCriteria.serialise(criteria)]);
  }

  private setFiltering(params: Params) {
    const defaultFilter = this.criteria || new FilterCriteria();
    return this.criteria = isEmpty(params) ?
      defaultFilter :
      Object.assign(defaultFilter, FilterCriteria.deserialise(params));
  }
}
