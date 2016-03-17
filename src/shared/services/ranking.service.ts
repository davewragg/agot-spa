import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {FilterCriteria} from '../models/filter-criteria.model';
import {SetOfResults} from '../models/set-of-results.model';

@Injectable()
export class RankingService {
  constructor(private dataService:DataService) {
  }

  getRankings(filterCriteria:FilterCriteria):Observable<SetOfResults> {
    return this.dataService.getRankings(filterCriteria);
  }
}
