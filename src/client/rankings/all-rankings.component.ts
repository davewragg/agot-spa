import {Component, OnInit, Input} from 'angular2/core';
import {SetOfResults} from '../shared/models/set-of-results.model';
import {RankingService} from '../shared/services/ranking.service';
import {RankingsComponent} from './rankings.component';
import {SpinnerComponent} from '../shared/components/spinner.component';
import {FilterCriteria} from '../shared/models/filter-criteria.model';
import {Router, RouteParams} from 'angular2/router';
import {DateRangeComponent} from '../home/components/date-range.component';

@Component({
  selector: 'agot-all-rankings',
  templateUrl: 'rankings/all-rankings.component.html',
  directives: [RankingsComponent, SpinnerComponent, DateRangeComponent]
})
export class AllRankingsComponent implements OnInit {
  @Input()
  title:string;
  @Input()
  hideFilters:boolean = false;
  @Input()
  initialFiltering:FilterCriteria;

  results:SetOfResults;
  loadingError:any = null;
  isLoading:boolean;

  constructor(params:RouteParams,
              private _router:Router,
              private _RankingService:RankingService) {
    this.setInitialFiltering(params);
  }

  ngOnInit() {
    this.loadRankings(this.initialFiltering);
  }

  onDateRangeChange(criteria:FilterCriteria) {
    //this.loadRankings(criteria);
    this._router.navigate(['AllRankings', FilterCriteria.serialise(criteria)]);
  }

  loadRankings(criteria?:FilterCriteria) {
    this.isLoading = true;
    this._RankingService.getRankings(criteria)
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

  private setInitialFiltering(params:RouteParams) {
    this.initialFiltering = Object.assign(this.initialFiltering || {}, FilterCriteria.deserialise(params));
  }
}
