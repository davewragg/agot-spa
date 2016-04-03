import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {FilterCriteria} from '../models/filter-criteria.model';
import {SetOfResults} from '../models/set-of-results.model';
import {CacheService} from './cache.service';

@Injectable()
export class RankingService {

  constructor(private dataService:DataService, private cacheService:CacheService) {
  }

  getRankings(filterCriteria:FilterCriteria):Observable<SetOfResults> {
    return this.cacheService.getFilteredData('rankings', this.dataService.getRankings, filterCriteria, this.dataService);
  }
}
