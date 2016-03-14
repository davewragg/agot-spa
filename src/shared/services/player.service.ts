import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {DataService} from './data.service';
import {ReferenceDataService} from './reference-data.service';
import {Player} from '../models/player.model';
import {Game} from '../models/game.model';
import {GamePlayer} from '../models/game-player.model';
import {Result} from '../models/result.enum';
import {Stats} from '../models/stats.model';
import {PlayerStats} from '../models/player-stats.model';
import {FilterCriteria} from '../models/filter-criteria.model';
import {DeckClass} from '../models/deck-class.model';
import {PlayerStatsSet} from '../models/player-stats-set.model';
import {PlayerInsights} from '../models/player-insights.model';
import {Faction} from '../models/faction.model';
import {Agenda} from '../models/agenda.model';
import {DeckClassStats} from '../models/deck-class-stats.model';

@Injectable()
export class PlayerService {
  constructor(private _dataService:DataService, private _referenceDataService:ReferenceDataService) {
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
        if (playerStats.games.length === 0) {
          return playerStats;
        }
        return playerStats.sort();
      }).do((playerStats:PlayerStats) => {
        if (playerStats.games.length === 0) {
          return playerStats;
        }
        return this.buildPlayerInsights(playerStats);
      });

    function buildStatsFromGames(stats:PlayerStats, game:Game):PlayerStats {
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
      return !!getMe(game);
    }

    function getMe(game:Game) {
      return game.gamePlayers.find((gamePlayer:GamePlayer) => gamePlayer.playerId === playerId);
    }

    function getMyResult(game:Game, me:GamePlayer):Result {
      const winner:GamePlayer = game.gamePlayers.find((gamePlayer:GamePlayer) => gamePlayer.isWinner);
      return me.isWinner ? Result.WON : !!winner ? Result.LOST : Result.DREW;
    }

    function updateMyStats(me:GamePlayer, stats:PlayerStats, result:Result) {
      addResultFor(stats.overall, result);

      updatePlayerStats(me, stats.as, result);
    }

    function updatePlayerStats(player:GamePlayer, stats:PlayerStatsSet, result:Result) {
      if (!player.deck.secondFactionId) {
        const deckClassId = DeckClass.getDeckClassId(player.deck.factionId, player.deck.agendaId);
        updateStatsFor(deckClassId, stats.deckClass, result);
      }

      updateStatsFor(player.deck.agendaId, stats.agendas, result);
      updateStatsFor(player.deck.factionId, stats.factions, result);
      updateStatsFor(player.deck.secondFactionId, stats.factions, result);
    }

    function updateStatsFor(keyId:number | string, statsMap:Map<number | string, Stats>, result:Result) {
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

  private buildPlayerInsights(playerStats:PlayerStats):PlayerStats {
    const insights:PlayerInsights = playerStats.insights;
    insights.mostUsedDeckClass = this.findTopDeckClassBy(playerStats.as.deckClass, 'played');
    insights.mostSuccessfulDeckClass = this.findTopDeckClassBy(playerStats.as.deckClass, 'winPercentage');
    insights.leastSuccessfulDeckClass = this.findTopDeckClassBy(playerStats.as.deckClass, 'lossPercentage');
    insights.bestResultsVsDeckClass = this.findTopDeckClassBy(playerStats.vs.deckClass, 'winPercentage');
    insights.worstResultsVsDeckClass = this.findTopDeckClassBy(playerStats.vs.deckClass, 'lossPercentage');

    insights.neverPlayedFactions = this.filterOutPlayedFactions(playerStats.as.factions);
    insights.neverPlayedAgendas = this.filterOutPlayedAgendas(playerStats.as.agendas);

    return playerStats;
  }

  private findTopDeckClassBy(deckMap:Map<number, Stats>, field:string):DeckClassStats {
    const entries:[number, Stats][] = Array.from(deckMap.entries());
    const winningEntry:[number, Stats] = entries.reduce((lastEntry:[number, Stats], entry:[number, Stats]) => {
      if (!lastEntry) {
        return entry;
      }
      const currentStats:Stats = lastEntry[1];
      const newStats:Stats = entry[1];
      const currentStat:number = currentStats[field];
      const newStat:number = newStats[field];
      if (currentStat === newStat) {
        return currentStats.played > newStats.played ? lastEntry : entry;
      }
      return currentStat > newStat ? lastEntry : entry;
    });
    if (winningEntry && winningEntry[1][field] > 0) {
      const deckClass = this._referenceDataService.getDeckClass(winningEntry[0]);
      return new DeckClassStats(deckClass, winningEntry[1]);
    }
    return null;
  }

  private filterOutPlayedFactions(factionsMap:Map<number, Stats>):Faction[] {
    return <Faction[]>this.filterPlayed(this._referenceDataService.getFactions(), factionsMap, 'factionId');
  }

  private filterOutPlayedAgendas(agendasMap:Map<number, Stats>):Agenda[] {
    return <Agenda[]>this.filterPlayed(this._referenceDataService.getAgendas(), agendasMap, 'agendaId');
  }

  private filterPlayed(allValues:Array<any>, playedValuesMap:Map<number, Stats>, idField:string) {
    const allValuesCopy = Array.of(...allValues);
    Array.from(playedValuesMap.keys()).forEach((playedId:number) => {
      allValuesCopy.splice(allValuesCopy.findIndex((value) => value[idField] === playedId), 1);
    });

    return allValuesCopy;
  }
}
