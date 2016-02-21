import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {GameIndex} from '../models/game-index.model';

@Injectable()
export class RankingService {
  constructor(private dataService:DataService) {
  }

  getAllRankings():Observable<GameIndex> {
    return this.dataService.getGameIndex();
  }
}
