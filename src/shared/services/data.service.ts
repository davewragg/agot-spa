import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {GameIndex} from '../models/game-index.model';

@Injectable()
export class DataService {
  private data: Observable<GameIndex>;

  constructor(private http:Http) {
  }

  getGameIndex():Observable<GameIndex> {
    if (!this.data) {
      this.data = this._getGameIndex();
    }
    return this.data;
  }

  private _getGameIndex():Observable<GameIndex> {
    return this.getFromJson()
      .map((res:Response) => res.json());
  }

  private getFromJson():Observable<Response> {
    return this.http.get('/assets/data/GetAll.json');
  };

  //private getFromWeb():Observable<Response> {
  //  return this.http.get('/agot/Games/GetAll');
  //}
}
