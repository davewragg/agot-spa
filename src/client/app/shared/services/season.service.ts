import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';
import { Season } from '../models/season.model';

@Injectable()
export class SeasonService {
  private _data: Observable<Season[]>;

  constructor(private dataService: DataService) {
  }

  get seasons(): Observable<Season[]> {
    console.log('returning seasons');
    if (!this._data) {
      this._data = this._getSeasons();
    }
    return this._data;
  }

  private _getSeasons() {
    return this.dataService.getReferenceData('seasons').map((seasons: Season[]) => {
      return seasons.reverse();
    });
    // TODO .share()?
    // .cache();
  }
}
