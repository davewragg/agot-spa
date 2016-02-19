import {Injectable} from 'angular2/core';
import {Game} from '../models/game.model';
import {Http} from 'angular2/http';
import {Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class GameService {
  constructor(private http:Http) {
  }

  getGames():Observable<Game[]> {
    return this.http.get('/assets/data/GetAll.json')
      .map((res:Response) => res.json().allResults.games);
  }
}
