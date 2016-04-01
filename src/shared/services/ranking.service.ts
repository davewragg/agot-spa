import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {FilterCriteria} from '../models/filter-criteria.model';
import {SetOfResults} from '../models/set-of-results.model';

@Injectable()
export class RankingService {

  private _cache:Map<string, Observable<SetOfResults>> = new Map<string, Observable<SetOfResults>>();

  constructor(private dataService:DataService) {
  }

  invalidate() {
    console.log('!::invalidate rankings cache');
    this._cache.clear();
  }

  getRankings(filterCriteria:FilterCriteria):Observable<SetOfResults> {
    const key:string = filterCriteria ? JSON.stringify(filterCriteria) : 'ALL';
    console.log('get rankings', key);
    if (this._cache.has(key)) {
      console.log('::cached');
      return this._cache.get(key);
    }
    console.log('::not cached');
    const rankings = this.dataService.getRankings(filterCriteria).cache();
    this._cache.set(key, rankings);
    console.log('::rankings cache size', this._cache.size);
    return rankings;
  }
}
