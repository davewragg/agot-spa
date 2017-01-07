import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GameService } from './game.service';
import { ReferenceDataService } from './reference-data.service';
import { FilterCriteria } from '../models/filter-criteria.model';
import { Game } from '../models/game.model';
import { DeckStats } from '../models/deck-stats.model';
import { Faction } from '../models/faction.model';
import { Agenda } from '../models/agenda.model';
import { PlayerStats } from '../models/player-stats.model';
import { Result } from '../models/result.enum';
import { GamePlayer } from '../models/game-player.model';
import { StatsSet } from '../models/stats-set.model';
import { DeckClass } from '../models/deck-class.model';
import { Stats } from '../models/stats.model';
import { PlayerInsights } from '../models/player-insights.model';
import { DeckClassStats } from '../models/deck-class-stats.model';
import { CacheService } from './cache.service';
import * as _ from 'lodash';

@Injectable()
export class StatsService {
  private _factions: Faction[];
  private _agendas: Agenda[];

  static getResultForPlayer(game: Game, playerId: number): Result {
    const winner: GamePlayer = game.gamePlayers.find((gamePlayer: GamePlayer) => gamePlayer.isWinner);
    return !winner ? Result.DREW : winner.playerId === playerId ? Result.WON : Result.LOST;
  }

  static getResultForDeck(game: Game, deckId: number): Result[] {
    const winner: GamePlayer = game.gamePlayers.find((gamePlayer: GamePlayer) => gamePlayer.isWinner);
    const results: Result[] = [];
    game.gamePlayers.forEach((gamePlayer: GamePlayer) => {
      if (gamePlayer.deck.deckId === deckId) {
        results.push(gamePlayer.isWinner ? Result.WON : !!winner ? Result.LOST : Result.DREW);
      }
    });
    return results;
  }

  private static updateFactionAgendaStats(player: GamePlayer, stats: StatsSet, result: Result) {
    const deckClassId = DeckClass.getDeckClassId(player.deck.factionId, player.deck.agendaId);
    StatsService.updateStatsFor(deckClassId, stats.deckClass, result);

    StatsService.updateStatsFor(player.deck.agendaId, stats.agendas, result);
    StatsService.updateStatsFor(player.deck.factionId, stats.factions, result);
  }

  private static updateStatsFor(keyId: number | string, statsMap: Map<number | string, Stats>, result: Result) {
    if (keyId) {
      const keyStats = statsMap.get(keyId) || new Stats();
      StatsService.addResultFor(keyStats, result);
      statsMap.set(keyId, keyStats);
    }
  }

  private static addResultFor(keyStats: Stats, result: Result) {
    keyStats.played++;
    if (result === Result.WON) {
      keyStats.won++;
    } else if (result === Result.DREW) {
      keyStats.drawn++;
    } else {
      keyStats.lost++;
    }
  }

  constructor(private gameService: GameService,
              private _referenceDataService: ReferenceDataService,
              private cacheService: CacheService) {
    _referenceDataService.factions.subscribe((factions) => this._factions = factions);
    _referenceDataService.agendas.subscribe((agendas) => this._agendas = agendas);
  }

  getTimelineSortedGames(games: Game[]): any[] {
    return _.chain(games).groupBy((game: Game): string => {
      return game.date.substr(0, 10);
    }).toPairs()
      .map(([dateKey, games]:[string, Game[]]) => {
        const year = +dateKey.substr(0, 4);
        const month = +dateKey.substr(5, 2) - 1; // goddam zero indexed month
        const date = +dateKey.substr(8, 2);
        const dateInMillis = Date.UTC(year, month, date);
        return [dateInMillis, games];
      }).sortBy('0')
      .value();
  }

  getGamesPlayedData(sortedGames: [number, Game[]][]) {
    return sortedGames.map(([dateKey, games]:[number, Game[]]) => {
      //noinspection TypeScriptUnresolvedVariable
      return [dateKey, games.length];
    });
  }

  getDeckOrPlayerResultsData(sortedGames: [number, Game[]][], playerId: number, deckId: number) {
    const results: any = {
      [Result.WON]: [],
      [Result.DREW]: [],
      [Result.LOST]: []
    };
    sortedGames.forEach(([dateKey, games]:[number, Game[]]) => {
      //noinspection TypeScriptValidateTypes
      const resultsForDay = playerId ?
        getDayResultsForPlayer(games, playerId) :
        getDayResultsForDeck(games, deckId);
      Object.keys(results).forEach((key) => {
        const dayResults = resultsForDay.get(+key);
        if (dayResults) {
          results[key].push([dateKey, dayResults]);
        }
      });
    });
    return results;

    function getDayResultsForPlayer(games: Game[], playerId: number): Map<Result, number> {
      const resultsForDay: Map<Result, number> = new Map<Result, number>();
      games.forEach((game) => {
        const result = StatsService.getResultForPlayer(game, playerId);
        if (resultsForDay.has(result)) {
          const currentValue = resultsForDay.get(result);
          resultsForDay.set(result, currentValue + 1);
        } else {
          resultsForDay.set(result, 1);
        }
      });
      return resultsForDay;
    }

    function getDayResultsForDeck(games: Game[], deckId: number): Map<Result, number> {
      const resultsForDay: Map<Result, number> = new Map<Result, number>();
      games.forEach((game) => {
        const results = StatsService.getResultForDeck(game, deckId);
        results.forEach((result) => {
          if (resultsForDay.has(result)) {
            const currentValue = resultsForDay.get(result);
            resultsForDay.set(result, currentValue + 1);
          } else {
            resultsForDay.set(result, 1);
          }
        });
      });
      return resultsForDay;
    }
  }

  getDeckStats(deckId: number): Observable<PlayerStats> {
    const criteria = new FilterCriteria();
    criteria.deckIds = [deckId];
    return this.cacheService.getFilteredData('deckStats', this._getDeckStats, criteria, this);
  }

  _getDeckStats(criteria: FilterCriteria): Observable<DeckStats> {
    const deckId = _.first(criteria.deckIds);
    return this.gameService.getGames(Object.assign(new FilterCriteria(), { deckIds: [deckId], asc: false }))
      .map((games: Game[]): DeckStats => {
        return games.reduce(buildStatsFromGames, new DeckStats());
      }).do((deckStats: DeckStats) => {
        if (deckStats.games.length === 0) {
          return deckStats;
        }
        return deckStats.sort();
      });

    function buildStatsFromGames(stats: DeckStats, game: Game): DeckStats {
      stats.games.push(game);

      const winner: GamePlayer = game.gamePlayers.find((gamePlayer: GamePlayer) => gamePlayer.isWinner);

      game.gamePlayers.forEach(updateDeckStats);

      return stats;

      function updateDeckStats(gamePlayer: GamePlayer) {
        if (gamePlayer.deck.deckId === deckId) {
          let result = gamePlayer.isWinner ? Result.WON : !!winner ? Result.LOST : Result.DREW;
          StatsService.addResultFor(stats.overall, result);
          StatsService.updateStatsFor(gamePlayer.playerId, stats.as.players, result);
          // StatsService.updateFactionAgendaStats(gamePlayer, stats.as, result);
        } else {
          let result = !!winner ? winner.deck.deckId === deckId ? Result.WON : Result.LOST : Result.DREW;
          StatsService.updateStatsFor(gamePlayer.playerId, stats.vs.players, result);
          StatsService.updateFactionAgendaStats(gamePlayer, stats.vs, result);
        }
      }
    }
  }

  getPlayerStats(playerId: number, criteria: FilterCriteria): Observable<PlayerStats> {
    const criteriaCopy = _.cloneDeep(criteria);
    criteriaCopy.playerIds = [playerId];
    return this.cacheService.getFilteredData('playerStats', this._getPlayerStats, criteriaCopy, this);
  }

  _getPlayerStats(criteria: FilterCriteria): Observable<PlayerStats> {
    const playerId = _.first(criteria.playerIds);
    return this.gameService.getGames(criteria)
      .map((games: Game[]): PlayerStats => {
        return games
          .reduce(buildStatsFromGames, new PlayerStats());
      }).do((playerStats: PlayerStats) => {
        if (playerStats.games.length === 0) {
          return playerStats;
        }
        return playerStats.sort();
      }).do((playerStats: PlayerStats) => {
        if (playerStats.games.length === 0) {
          return playerStats;
        }
        return this.buildPlayerInsights(playerStats);
      });

    function buildStatsFromGames(stats: PlayerStats, game: Game): PlayerStats {
      stats.games.push(game);

      var me = getMe(game);
      const result: Result = StatsService.getResultForPlayer(game, me.playerId);

      updateMyStats(me, stats, result);

      game.gamePlayers.forEach(updateOpponentStats);

      return stats;

      function updateOpponentStats(gamePlayer: GamePlayer) {
        if (gamePlayer.playerId !== me.playerId) {
          StatsService.updateStatsFor(gamePlayer.playerId, stats.vs.players, result);
          StatsService.updateFactionAgendaStats(gamePlayer, stats.vs, result);
        }
      }
    }

    function getMe(game: Game) {
      return game.gamePlayers.find((gamePlayer: GamePlayer) => gamePlayer.playerId === playerId);
    }

    function updateMyStats(me: GamePlayer, stats: PlayerStats, result: Result) {
      StatsService.addResultFor(stats.overall, result);

      StatsService.updateFactionAgendaStats(me, stats.as, result);
    }
  }

  private buildPlayerInsights(playerStats: PlayerStats): PlayerStats {
    const insights: PlayerInsights = playerStats.insights;
    insights.mostUsedDeckClass = this.findTopDeckClassBy(playerStats.as.deckClass, 'played');
    insights.mostSuccessfulDeckClass = this.findTopDeckClassBy(playerStats.as.deckClass, 'winPercentage');
    insights.leastSuccessfulDeckClass = this.findTopDeckClassBy(playerStats.as.deckClass, 'lossPercentage');
    insights.bestResultsVsDeckClass = this.findTopDeckClassBy(playerStats.vs.deckClass, 'winPercentage');
    insights.worstResultsVsDeckClass = this.findTopDeckClassBy(playerStats.vs.deckClass, 'lossPercentage');

    insights.neverPlayedFactions = this.filterOutPlayedFactions(playerStats.as.factions);
    insights.neverPlayedAgendas = this.filterOutPlayedAgendas(playerStats.as.agendas);

    return playerStats;
  }

  private findTopDeckClassBy(deckMap: Map<number, Stats>, field: string): DeckClassStats {
    const entries: [number, Stats][] = Array.from(deckMap.entries());
    const winningEntry: [number, Stats] = entries.reduce((lastEntry: [number, Stats], entry: [number, Stats]) => {
      if (!lastEntry) {
        return entry;
      }
      const currentStats: Stats = lastEntry[1];
      const newStats: Stats = entry[1];
      const currentStat: number = currentStats[field];
      const newStat: number = newStats[field];
      if (currentStat === newStat) {
        return currentStats.played > newStats.played ? lastEntry : entry;
      }
      return currentStat > newStat ? lastEntry : entry;
    });
    if (winningEntry && winningEntry[1][field] > 0) {
      const deckClass = this.getDeckClass(winningEntry[0]);
      return new DeckClassStats(deckClass, winningEntry[1]);
    }
    return null;
  }

  private filterOutPlayedFactions(factionsMap: Map<number, Stats>): Faction[] {
    return <Faction[]>this.filterPlayed(this._factions, factionsMap, 'factionId');
  }

  private filterOutPlayedAgendas(agendasMap: Map<number, Stats>): Agenda[] {
    return <Agenda[]>this.filterPlayed(this._agendas, agendasMap, 'agendaId');
  }

  private filterPlayed(allValues: Array<any>, playedValuesMap: Map<number, Stats>, idField: string) {
    const allValuesCopy = Array.of(...allValues);
    Array.from(playedValuesMap.keys()).forEach((playedId: number) => {
      allValuesCopy.splice(allValuesCopy.findIndex((value) => value[idField] === playedId), 1);
    });

    return allValuesCopy;
  }

  // TODO legacy sticking plaster
  private getFaction(factionId: number): Faction {
    return this._factions.find((faction) => faction.factionId === factionId);
  }

  // TODO legacy sticking plaster
  private getAgenda(agendaId: number): Agenda {
    return this._agendas.find((agenda) => agenda.agendaId === agendaId);
  }

  // TODO legacy sticking plaster
  private getDeckClass(deckClassId: number): DeckClass {
    const ids = DeckClass.getFactionAndAgendaId(deckClassId);
    return new DeckClass(this.getFaction(ids.factionId), this.getAgenda(ids.agendaId));
  }
}
