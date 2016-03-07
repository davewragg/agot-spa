import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {GameIndex} from '../models/game-index.model';
import {Season} from '../models/season.model';

@Injectable()
export class SeasonService {
  constructor(private dataService:DataService) {
  }

  getAllSeasons():Observable<Season[]> {
    return this.dataService.getGameIndex().map((gameIndex:GameIndex) => gameIndex.seasons);
  }
}
