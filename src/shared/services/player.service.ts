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
import {PlayerStatsSet} from '../models/player-stats-set.model';

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
          updateStatsFor(gamePlayer.playerId, stats.vs.players, result);
          updatePlayerStats(gamePlayer, stats.vs, result);
        }
      }
    }

    function filterMyGames(game:Game) {
      return !!game.gamePlayers.find(
        (gamePlayer:GamePlayer) => gamePlayer.playerId === playerId
      );
    }

    function getMe(game:Game) {
      return game.gamePlayers.find((gamePlayer:GamePlayer) => gamePlayer.playerId === playerId);
    }

    function getMyResult(game, me):Result {
      const winner:GamePlayer = game.gamePlayers.find((gamePlayer:GamePlayer) => gamePlayer.isWinner);
      return me.isWinner ? Result.WON : !!winner ? Result.LOST : Result.DREW;
    }

    function updateMyStats(me:GamePlayer, stats:PlayerStats, result:Result) {
      const overallStats = stats.overall;
      addResultFor(overallStats, result);

      updatePlayerStats(me, stats.as, result);
    }

    function updatePlayerStats(player:GamePlayer, stats:PlayerStatsSet, result) {
      if (!player.secondFactionId) {
        const deckClassId = DeckClass.getDeckClassId(player.factionId, player.agendaId);
        updateStatsFor(deckClassId, stats.deckClass, result);
      }

      updateStatsFor(player.agendaId, stats.agendas, result);
      updateStatsFor(player.factionId, stats.factions, result);
      updateStatsFor(player.secondFactionId, stats.factions, result);
    }

    function updateStatsFor(keyId, statsMap:Map<number, Stats>, result:Result) {
      if (keyId) {
        const keyStats = statsMap.get(keyId) || new Stats();
        addResultFor(keyStats, result);
        statsMap.set(keyId, keyStats);
      }
    }

    function addResultFor(keyStats:Stats, result:Result) {
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

