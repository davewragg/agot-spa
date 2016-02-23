import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {GameIndex} from '../models/game-index.model';
import {Game} from '../models/game.model';

@Injectable()
export class DataService {
  private data:Observable<GameIndex>;

  private static _serialiseGame(game:Game):string {
    return JSON.stringify(game);
  }

  constructor(private http:Http) {
  }

  getGameIndex():Observable<GameIndex> {
    if (!this.data) {
      this.data = this._getGameIndex();
    }
    return this.data;
  }

  updateGame(game:Game):Observable<Game> {
    return this.http.put('/agot/Games/Update', DataService._serialiseGame(game))
      .map((response:Response) => response.json());
    // TODO update cache? PBR covered?
  }

  createGame(game:Game):Observable<Game> {
    return this.http.post('/agot/Games/Create', DataService._serialiseGame(game))
      .map((response:Response) => response.json());
    // TODO check for response id
    // TODO insert into cache
  }

  private _getGameIndex():Observable<GameIndex> {
    return this.getFromJson()
      .map((res:Response) => res.json());
  }

  private getFromJson():Observable<Response> {
    return this.http.get('/assets/data/GetAll.json');
  }

  //private getFromWeb():Observable<Response> {
  //  return this.http.get('/agot/Games/GetAll');
  //}
}
