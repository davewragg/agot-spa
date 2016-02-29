import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {Player} from '../models/player.model';
import {GameIndex} from '../models/game-index.model';
import {Game} from '../models/game.model';
import {GamePlayer} from '../models/game-player.model';

@Injectable()
export class PlayerService {
  constructor(private _dataService:DataService) {
  }

  getPlayers():Player[] {
    // TODO async
    return [
      {playerId: 1, name: 'Fonz'},
      {playerId: 2, name: 'Dan'},
      {playerId: 3, name: 'Dave'},
      {playerId: 4, name: 'James'},
    ];
  }

  getPlayer(playerId:number):Player {
    // TODO async
    return this.getPlayers().find((player:Player) => player.playerId === playerId);
  }

  getPlayerStats(playerId:number):Observable<any> {
    const stats = {
      games: [],
      factions: new Map(),
      agendas: new Map(),
      players: new Map()
    };
    return this._dataService.getGameIndex().map((gameIndex:GameIndex) => {
      return gameIndex.allResults.games.filter((game:Game) => {
        return !!game.gamePlayers.find(
          (gamePlayer:GamePlayer) => gamePlayer.playerId === playerId
        );
      }).forEach((game:Game) => {
        stats.games.push(game);
        const me = game.gamePlayers.find((gamePlayer:GamePlayer) => gamePlayer.playerId === playerId);
        const isWinner = me.isWinner;

        if (me.agendaId) {
          const agendaStats = stats.agendas.get(me.agendaId) || <Stats>{won: 0, drawn: 0, lost: 0};
          if (isWinner) {
            agendaStats.won++;
          } else {
            agendaStats.lost++;
          }
          stats.agendas.set(me.agendaId, agendaStats);
        }
        return stats;
      });
    }).map(() => {
      return stats;
    });
  }
}

interface Stats {
  won:number;
  drawn:number;
  lost:number;
}
