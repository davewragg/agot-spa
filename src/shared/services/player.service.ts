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
import {DeckClass} from '../models/deck-class.model';

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

  getPlayerStats(playerId:number, criteria:FilterCriteria):Observable<PlayerStats> {
    return this._dataService.getGames(criteria)
      .map((games:Game[]):PlayerStats => {
        return games
          .filter(filterMyGames)
          .reduce(buildStatsFromGames, new PlayerStats());
      }).do((playerStats:PlayerStats) => {
        return playerStats.sort();
      });

    function buildStatsFromGames(stats:PlayerStats, game:Game):any {
      stats.games.push(game);

      var me = getMe(game);
      const result:Result = getMyResult(game, me);

      updateMyStats(me, stats, result);

      game.gamePlayers.forEach(updateOpponentStats);

      return stats;

      function updateOpponentStats(gamePlayer:GamePlayer) {
        if (gamePlayer.playerId !== me.playerId) {
          const deckClassId = DeckClass.getDeckClassId(gamePlayer.factionId, gamePlayer.agendaId);
          updateStatsFor(deckClassId, stats.deckClassVs, result);
          updateStatsFor(gamePlayer.playerId, stats.playersVs, result);
          updateStatsFor(gamePlayer.agendaId, stats.agendasVs, result);
          updateStatsFor(gamePlayer.factionId, stats.factionsVs, result);
          updateStatsFor(gamePlayer.secondFactionId, stats.factionsVs, result);
        }
      }
    }

    function filterMyGames(game:Game) {
      return !!game.gamePlayers.find(
        (gamePlayer:GamePlayer) => gamePlayer.playerId === playerId
      );
    }

    function getMe(game) {
      return game.gamePlayers.find((gamePlayer:GamePlayer) => gamePlayer.playerId === playerId);
    }

    function getMyResult(game, me):Result {
      const winner:GamePlayer = game.gamePlayers.find((gamePlayer:GamePlayer) => gamePlayer.isWinner);
      return me.isWinner ? Result.WON : !!winner ? Result.LOST : Result.DREW;
    }

    function updateMyStats(me, stats, result) {
      const overallStats = stats.overall;
      addResultFor(overallStats, result);

      const deckClassId = DeckClass.getDeckClassId(me.factionId, me.agendaId);
      updateStatsFor(deckClassId, stats.deckClassAs, result);

      updateStatsFor(me.agendaId, stats.agendasAs, result);
      updateStatsFor(me.factionId, stats.factionsAs, result);
      updateStatsFor(me.secondFactionId, stats.factionsAs, result);
    }

    function updateStatsFor(keyId, statsMap:Map<number, Stats>, result:Result) {
      if (keyId) {
        const keyStats = statsMap.get(keyId) || new Stats();
        addResultFor(keyStats, result);
        statsMap.set(keyId, keyStats);
      }
    }

    function addResultFor(keyStats, result) {
      keyStats.played++;
      if (result === Result.WON) {
        keyStats.won++;
      } else if (result === Result.DREW) {
        keyStats.drawn++;
      } else {
        keyStats.lost++;
      }
    }
  }
}

