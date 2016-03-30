import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {GameService} from './game.service';
import {ReferenceDataService} from './reference-data.service';
import {FilterCriteria} from '../models/filter-criteria.model';
import {Game} from '../models/game.model';
import {DeckStats} from '../models/deck-stats.model';
import {Faction} from '../models/faction.model';
import {Agenda} from '../models/agenda.model';
import {PlayerStats} from '../models/player-stats.model';
import {Result} from '../models/result.enum';
import {GamePlayer} from '../models/game-player.model';
import {StatsSet} from '../models/stats-set.model';
import {DeckClass} from '../models/deck-class.model';
import {Stats} from '../models/stats.model';
import {PlayerInsights} from '../models/player-insights.model';
import {DeckClassStats} from '../models/deck-class-stats.model';

@Injectable()
export class StatsService {
  private _factions:Faction[];
  private _agendas:Agenda[];

  private static updateFactionAgendaStats(player:GamePlayer, stats:StatsSet, result:Result) {
    if (!player.deck.secondFactionId) {
      const deckClassId = DeckClass.getDeckClassId(player.deck.factionId, player.deck.agendaId);
      StatsService.updateStatsFor(deckClassId, stats.deckClass, result);
    }

    StatsService.updateStatsFor(player.deck.agendaId, stats.agendas, result);
    StatsService.updateStatsFor(player.deck.factionId, stats.factions, result);
    StatsService.updateStatsFor(player.deck.secondFactionId, stats.factions, result);
  }

  private static updateStatsFor(keyId:number | string, statsMap:Map<number | string, Stats>, result:Result) {
    if (keyId) {
      const keyStats = statsMap.get(keyId) || new Stats();
      StatsService.addResultFor(keyStats, result);
      statsMap.set(keyId, keyStats);
    }
  }

  private static addResultFor(keyStats:Stats, result:Result) {
    keyStats.played++;
    if (result === Result.WON) {
      keyStats.won++;
    } else if (result === Result.DREW) {
      keyStats.drawn++;
    } else {
      keyStats.lost++;
    }
  }

  constructor(private gameService:GameService, private _referenceDataService:ReferenceDataService) {
    _referenceDataService.factions.subscribe((factions) => this._factions = factions);
    _referenceDataService.agendas.subscribe((agendas) => this._agendas = agendas);
  }

  getDeckStats(deckId:number):Observable<DeckStats> {
    return this.gameService.getGames(<FilterCriteria>{deckIds: [deckId]})
      .map((games:Game[]):DeckStats => {
        return games.reduce(buildStatsFromGames, new DeckStats());
      }).do((deckStats:DeckStats) => {
        if (deckStats.games.length === 0) {
          return deckStats;
        }
        return deckStats.sort();
      });

    function buildStatsFromGames(stats:DeckStats, game:Game):DeckStats {
      stats.games.push(game);

      const winner:GamePlayer = game.gamePlayers.find((gamePlayer:GamePlayer) => gamePlayer.isWinner);

      game.gamePlayers.forEach(updateDeckStats);

      return stats;

      function updateDeckStats(gamePlayer:GamePlayer) {
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

  getPlayerStats(playerId:number, criteria:FilterCriteria):Observable<PlayerStats> {
    criteria.playerIds = [playerId];
    return this.gameService.getGames(criteria)
      .map((games:Game[]):PlayerStats => {
        return games
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
          StatsService.updateStatsFor(gamePlayer.playerId, stats.vs.players, result);
          StatsService.updateFactionAgendaStats(gamePlayer, stats.vs, result);
        }
      }
    }

    function getMe(game:Game) {
      return game.gamePlayers.find((gamePlayer:GamePlayer) => gamePlayer.playerId === playerId);
    }

    function getMyResult(game:Game, me:GamePlayer):Result {
      const winner:GamePlayer = game.gamePlayers.find((gamePlayer:GamePlayer) => gamePlayer.isWinner);
      return me.isWinner ? Result.WON : !!winner ? Result.LOST : Result.DREW;
    }

    function updateMyStats(me:GamePlayer, stats:PlayerStats, result:Result) {
      StatsService.addResultFor(stats.overall, result);

      StatsService.updateFactionAgendaStats(me, stats.as, result);
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
      const deckClass = this.getDeckClass(winningEntry[0]);
      return new DeckClassStats(deckClass, winningEntry[1]);
    }
    return null;
  }

  private filterOutPlayedFactions(factionsMap:Map<number, Stats>):Faction[] {
    return <Faction[]>this.filterPlayed(this._factions, factionsMap, 'factionId');
  }

  private filterOutPlayedAgendas(agendasMap:Map<number, Stats>):Agenda[] {
    return <Agenda[]>this.filterPlayed(this._agendas, agendasMap, 'agendaId');
  }

  private filterPlayed(allValues:Array<any>, playedValuesMap:Map<number, Stats>, idField:string) {
    const allValuesCopy = Array.of(...allValues);
    Array.from(playedValuesMap.keys()).forEach((playedId:number) => {
      allValuesCopy.splice(allValuesCopy.findIndex((value) => value[idField] === playedId), 1);
    });

    return allValuesCopy;
  }

  // TODO legacy sticking plaster
  private getFaction(factionId:number):Faction {
    return this._factions.find((faction) => faction.factionId === factionId);
  }

  // TODO legacy sticking plaster
  private getAgenda(agendaId:number):Agenda {
    return this._agendas.find((agenda) => agenda.agendaId === agendaId);
  }

  // TODO legacy sticking plaster
  private getDeckClass(deckClassId:number):DeckClass {
    const ids = DeckClass.getFactionAndAgendaId(deckClassId);
    return new DeckClass(this.getFaction(ids.factionId), this.getAgenda(ids.agendaId));
  }
}
