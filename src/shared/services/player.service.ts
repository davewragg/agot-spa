import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {Player} from '../models/player.model';
import {BehaviorSubject} from 'rxjs/Rx';

@Injectable()
export class PlayerService {
  // TODO fix this giant mess
  private _players$:BehaviorSubject<Player[]> = new BehaviorSubject([]);

  constructor(private _dataService:DataService) {
    this.loadInitialData();
  }

  get players() {
    console.log('returning players');
    return this._players$.asObservable();
  }

  getPlayer(playerId:number):Observable<Player> {
    return this._players$.map((players:Player[]) => players.find((player:Player) => player.playerId === playerId));
  }

  private loadInitialData() {
    this._dataService.getReferenceData('players').subscribe(
      (players:Player[]) => {
        this._players$.next(players);
      },
      (err) => console.error(err)
    );
  }
}
