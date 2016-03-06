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
        return playerStats.sort();
      }).do((playerStats:PlayerStats) => {
        return this.buildPlayerInsights(playerStats);
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

  private findTopDeckClassBy(deckMap:Map<number, Stats>, field:string):DeckClass {
    const entries:[number, Stats][] = Array.from(deckMap.entries());
    const winningEntry:[number, Stats] = entries.reduce((lastEntry:[number, Stats], entry:[number, Stats]) => {
      if (!lastEntry) {
        return entry;
      }
      const currentStats:Stats = lastEntry[1];
      const newStats:Stats = entry[1];
      if (currentStats[field] === newStats[field]) {
        return currentStats.played > newStats.played ? lastEntry : entry;
      }
      return currentStats[field] > newStats[field] ? lastEntry : entry;
    });
    return winningEntry && winningEntry[1][field] > 0 ? this._referenceDataService.getDeckClass(winningEntry[0]) : null;
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

