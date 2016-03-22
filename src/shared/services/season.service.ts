import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {Season} from '../models/season.model';
import {BehaviorSubject} from 'rxjs/Rx';

@Injectable()
export class SeasonService {
  private _seasons$:BehaviorSubject<Season[]> = new BehaviorSubject([]);

  constructor(private dataService:DataService) {
    this.loadInitialData();
  }

  get seasons():Observable<Season[]> {
    console.log('returning seasons');
    return this._seasons$.asObservable();
  }

  private loadInitialData() {
    return this.dataService.getReferenceData('seasons').subscribe(
      (seasons:Season[]) => {
        this._seasons$.next(seasons);
      },
      (err) => console.error(err)
    );
  }
}
