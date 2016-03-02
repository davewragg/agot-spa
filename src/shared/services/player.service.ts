import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {Player} from '../models/player.model';
import {Game} from '../models/game.model';
import {GamePlayer} from '../models/game-player.model';
import {Result} from '../models/result.enum';
import {Stats} from '../models/stats.model';
import {PlayerStats} from '../models/player-stats.model';
import {FilterCriteria} from '../models/filter-criteria.model';

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

  getPlayerStats(playerId:number, criteria:FilterCriteria):Observable<any> {
    const stats = <PlayerStats>{
      games: [],
      overall: <Stats>{played: 0, won: 0, drawn: 0, lost: 0},
      factionsVs: new Map<number, Stats>(),
      factionsAs: new Map<number, Stats>(),
      agendasVs: new Map<number, Stats>(),
      agendasAs: new Map<number, Stats>(),
      playersVs: new Map<number, Stats>()
    };
    return this._dataService.getGames(criteria).map((games:Game[]) => {
      return games.filter((game:Game) => {
        return !!game.gamePlayers.find(
          (gamePlayer:GamePlayer) => gamePlayer.playerId === playerId
        );
      }).reduce((lastGame:Game, game:Game, currentIndex:number, games:Game[]):any => {
        stats.games.push(game);
        const winner:GamePlayer = game.gamePlayers.find((gamePlayer:GamePlayer) => gamePlayer.isWinner);
        const me = game.gamePlayers.find((gamePlayer:GamePlayer) => gamePlayer.playerId === playerId);
        const result:Result = me.isWinner ? Result.WON : !!winner ? Result.LOST : Result.DREW;

        const overallStats = stats.overall;
        this.setResult(overallStats, result);

        this.setStats(me.agendaId, stats.agendasAs, result);
        this.setStats(me.factionId, stats.factionsAs, result);
        this.setStats(me.secondFactionId, stats.factionsAs, result);

        game.gamePlayers.forEach((gamePlayer:GamePlayer) => {
          if (gamePlayer.playerId !== me.playerId) {
            this.setStats(gamePlayer.playerId, stats.playersVs, result);
            this.setStats(gamePlayer.agendaId, stats.agendasVs, result);
            this.setStats(gamePlayer.factionId, stats.factionsVs, result);
            this.setStats(gamePlayer.secondFactionId, stats.factionsVs, result);
          }
        });

        return stats;
      }, stats);
    });
  }

  private setStats(keyId, statsMap:Map<number, Stats>, result:Result) {
    if (keyId) {
      const keyStats = statsMap.get(keyId) || <Stats>{played: 0, won: 0, drawn: 0, lost: 0};
      this.setResult(keyStats, result);
      statsMap.set(keyId, keyStats);
    }
  };

  private setResult(keyStats, result) {
    keyStats.played++;
    if (result === Result.WON) {
      keyStats.won++;
    } else if (result === Result.DREW) {
      keyStats.drawn++;
    } else {
      keyStats.lost++;
    }
  };
}

