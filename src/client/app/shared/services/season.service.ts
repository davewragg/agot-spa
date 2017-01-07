import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';
import { Season } from '../models/season.model';

@Injectable()
export class SeasonService {
  private _data: Observable<Season[]>;

  private static convertDateString(dateString?: string) {
    // have to remove the time and timezone to populate the control correctly
    return dateString && dateString.slice(0, 10);
  }

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
      return seasons.map((season: Season) => {
        season.endDate = SeasonService.convertDateString(season.endDate);
        season.startDate = SeasonService.convertDateString(season.startDate);
        return season;
      }).reverse();
    })
      .publishReplay(1).refCount();
  }
}
