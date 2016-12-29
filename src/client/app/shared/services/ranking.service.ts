import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';
import { FilterCriteria } from '../models/filter-criteria.model';
import { SetOfResults } from '../models/set-of-results.model';
import { CacheService } from './cache.service';
import * as _ from 'lodash';

@Injectable()
export class RankingService {

  constructor(private dataService: DataService, private cacheService: CacheService) {
  }

  getRankings(filterCriteria: FilterCriteria): Observable<SetOfResults> {
    return this.cacheService.getFilteredData('rankings', this.dataService.getRankings, filterCriteria, this.dataService)
      .map((results: SetOfResults): SetOfResults => {
        results.playerWinLossRecord = _.mapValues(results.playerWinLossRecord,
          (gameResults) => gameResults.reverse());
        return results;
      });
  }
}
