import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {Season} from '../models/season.model';

@Injectable()
export class SeasonService {
  constructor(private dataService:DataService) {
  }

  // TODO cache and share
  getAllSeasons():Observable<Season[]> {
    return this.dataService.getReferenceData('seasons');
  }
}
