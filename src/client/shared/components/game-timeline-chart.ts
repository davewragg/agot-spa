import {Component, Input, ChangeDetectionStrategy, OnInit} from 'angular2/core';
import {CHART_DIRECTIVES} from 'angular2-highcharts/index';
import {Game} from '../models/game.model';
import {Result} from '../models/result.enum';
import {StatsService} from '../services/stats.service';
import * as _ from 'lodash';

@Component({
  selector: 'agot-game-timeline-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row">
      <chart class="col-xs-12" [options]="options"></chart>
    </div>
  `,
  directives: [CHART_DIRECTIVES]
})
export class GameTimelineChart implements OnInit {
  @Input()
  games:Game[];

  @Input()
  playerId:number;
  @Input()
  deckId:number;

  private options:any = {};

  private labels:any = {
    [Result.WON]: 'Won',
    [Result.DREW]: 'Drew',
    [Result.LOST]: 'Lost'
  };
  private colours:any = {
    [Result.WON]: '#356921',
    [Result.DREW]: '#666',
    [Result.LOST]: '#b30001'
  };

  ngOnInit() {
    const series = this.getDataSeries();
    console.log(series);

    this.options = {
      chart: {},
      title: {
        text: null
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: 'Games'
        },
        // stackLabels: {
        //   enabled: true
        // },
        min: 0,
        allowDecimals: false,
        crosshair: true
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            color: 'white',
            style: {
              textShadow: '0 0 3px black'
            }
          }
        }
      },
      series: series
    };
  }

  private getDataSeries():any[] {
    const sortedGames = this.getSortedGames();

    if (!this.playerId && !this.deckId) {
      return this.getGameOnlyDataSeries(sortedGames);
    }

    const results = this.getDeckPlayerResults(sortedGames);

    return Object.keys(results).map((key) => {
      return {
        type: 'column',
        name: this.labels[key],
        borderWidth: 1,
        borderColor: '#530001',
        color: this.colours[key],
        pointRange: 24 * 3600 * 1000,
        data: results[key]
      };
    });
  }

  private getGameOnlyDataSeries(sortedGames) {
    return [{
      type: 'column',
      name: 'Games',
      borderWidth: 1,
      borderColor: '#530001',
      color: '#d30001',
      pointRange: 24 * 3600 * 1000,
      data: sortedGames.map(([dateKey, games]) => {
        return [dateKey, games.length];
      })
    }];
  }

  private getDeckPlayerResults(sortedGames:[number, Game[]][]) {
    const results:any = {
      [Result.WON]: [],
      [Result.DREW]: [],
      [Result.LOST]: []
    };
    sortedGames.forEach(([dateKey, games]:[number, Game[]]) => {
      const resultsForDay = this.playerId ?
        getDayResultsForPlayer(games, this.playerId) :
        getDayResultsForDeck(games, this.deckId);
      Object.keys(results).forEach((key) => {
        const dayResults = resultsForDay.get(+key);
        if (dayResults) {
          results[key].push([dateKey, dayResults]);
        }
      });
    });
    return results;

    function getDayResultsForPlayer(games, playerId):Map<Result, number> {
      const resultsForDay:Map<Result, number> = new Map<Result, number>();
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

    function getDayResultsForDeck(games, deckId):Map<Result, number> {
      const resultsForDay:Map<Result, number> = new Map<Result, number>();
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

  private getSortedGames():[number, Game[]] {
    return _.chain(this.games).groupBy((game:Game) => {
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
}
